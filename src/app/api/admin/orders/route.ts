import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { orders, orderItems, dishes } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
  }
  
  const db = getDb();
  
  // Fetch orders joined with items and dish names
  const results = await db.select({
    order: orders,
    item: orderItems,
    dishName: dishes.name,
  })
  .from(orders)
  .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
  .leftJoin(dishes, eq(orderItems.dishId, dishes.id))
  .where(eq(orders.tenantId, tenantId));

  // Group items by order
  const ordersMap = new Map();
  
  results.forEach(({ order, item, dishName }) => {
    if (!ordersMap.has(order.id)) {
      ordersMap.set(order.id, { ...order, items: [] });
    }
    if (item) {
      ordersMap.get(order.id).items.push({
        ...item,
        dishName: dishName || 'Unknown Dish'
      });
    }
  });
  
  return NextResponse.json(Array.from(ordersMap.values()));
}
