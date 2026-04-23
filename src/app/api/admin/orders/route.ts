import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';



export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
  }
  
  const db = getDb();
  const allOrders = await db.select().from(orders).where(eq(orders.tenantId, tenantId));
  
  return NextResponse.json(allOrders);
}
