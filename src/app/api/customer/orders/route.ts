import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { signTableUrl } from '@/lib/utils';
import { eq, and, ne } from 'drizzle-orm';
import { getEnv } from '@/lib/cloudflare';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const tableId = searchParams.get('tableId');
    const tableNumber = searchParams.get('tableNumber');
    const signature = searchParams.get('signature');

    if (!tenantId || !tableId || !tableNumber || !signature) {
      return NextResponse.json({ error: 'Missing required tracking parameters' }, { status: 400 });
    }

    // Security: Validate HMAC Signature
    const secret = getEnv().JWT_SECRET || 'fallback-secret';
    const expectedSignature = await signTableUrl(tenantId, tableNumber, secret);
    
    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid table signature' }, { status: 403 });
    }

    const db = getDb();
    
    // Fetch active orders for this table (not completed or cancelled)
    const activeOrders = await db.select().from(orders).where(and(
      eq(orders.tenantId, tenantId),
      eq(orders.tableId, tableId),
      ne(orders.status, 'completed'),
      ne(orders.status, 'cancelled')
    )).orderBy(orders.createdAt);

    // Fetch items for these orders
    const ordersWithItems = await Promise.all(activeOrders.map(async (order) => {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      return { ...order, items };
    }));

    return NextResponse.json(ordersWithItems);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json() as any;
    const { tenantId, tableId, tableNumber, signature, items, totalPrice } = body;
    
    if (!tenantId || !tableId || !tableNumber || !signature || !items || !items.length) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
    }

    // Security: Validate HMAC Signature
    const secret = getEnv().JWT_SECRET || 'fallback-secret';
    const expectedSignature = await signTableUrl(tenantId, tableNumber, secret);
    
    if (signature !== expectedSignature) {
      console.error(`[Order Security] Signature mismatch. Received: ${signature}, Expected: ${expectedSignature} for Table: ${tableNumber}, Tenant: ${tenantId}`);
      return NextResponse.json({ error: 'Invalid table signature. Forgery detected.' }, { status: 403 });
    }

    const orderId = crypto.randomUUID();
    
    const [newOrder] = await db.insert(orders).values({
      id: orderId,
      tenantId,
      tableId,
      totalPrice,
      status: 'pending'
    }).returning();
    
    const orderItemsToInsert = items.map((item: any) => ({
      id: crypto.randomUUID(),
      orderId,
      dishId: item.dishId,
      quantity: item.quantity,
      priceAtTime: item.price,
      notes: item.notes
    }));
    
    await db.insert(orderItems).values(orderItemsToInsert);

    // Real-Time Push: Notify Tenant Hub of New Order
    try {
      const env = getEnv();
      if (env.ORDER_SYNC) {
        const id = env.ORDER_SYNC.idFromName(tenantId);
        const obj = env.ORDER_SYNC.get(id);
        
        await obj.fetch(new URL("http://localhost/notify"), {
          method: "POST",
          body: JSON.stringify({ 
            type: "new-order", 
            orderId, 
            tableId, 
            tableNumber,
            totalPrice 
          })
        });
      }
    } catch (broadcastError) {
      console.error("[Real-Time] Failed to broadcast new order:", broadcastError);
    }
    
    return NextResponse.json({ success: true, order: newOrder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
