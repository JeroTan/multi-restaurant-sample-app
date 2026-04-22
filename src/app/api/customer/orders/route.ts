import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { signTableUrl } from '@/lib/utils';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { tenantId, tableId, tableNumber, signature, items, totalPrice } = body;
    
    if (!tenantId || !tableId || !tableNumber || !signature || !items || !items.length) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
    }

    // Security: Validate HMAC Signature
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const expectedSignature = await signTableUrl(tenantId, tableNumber, secret);
    
    if (signature !== expectedSignature) {
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
    
    return NextResponse.json({ success: true, order: newOrder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
