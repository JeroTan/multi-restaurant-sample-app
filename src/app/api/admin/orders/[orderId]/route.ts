import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { orders } from '@/db/schema';
import { eq, and } from 'drizzle-orm';



export async function PATCH(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const db = getDb();
    const body = await request.json() as any;
    const { tenantId, status } = body;
    
    if (!tenantId || !status) {
      return NextResponse.json({ error: 'tenantId and status required' }, { status: 400 });
    }
    
    const [updated] = await db.update(orders)
      .set({ status })
      .where(and(eq(orders.id, params.orderId), eq(orders.tenantId, tenantId)))
      .returning();
      
    if (!updated) {
      return NextResponse.json({ error: 'Order not found or tenant mismatch' }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
