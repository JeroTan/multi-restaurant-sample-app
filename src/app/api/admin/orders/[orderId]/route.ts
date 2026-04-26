import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { orders } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PATCH(request: Request, props: { params: Promise<{ orderId: string }> }) {
  try {
    const params = await props.params;
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

    // Real-Time Push: Notify Durable Object
    try {
      // In Cloudflare Workers, we can access bindings via process.env in Next.js (OpenNext)
      // or directly via global environment in the custom wrapper.
      const env = (process.env as unknown as Env);
      if ((env as any).ORDER_SYNC) {
        // Now routing to a single Tenant Hub instance
        const id = (env as any).ORDER_SYNC.idFromName(tenantId);
        const obj = (env as any).ORDER_SYNC.get(id);
        
        // Internal DO call to broadcast the change
        await obj.fetch(new URL("http://localhost/notify"), {
          method: "POST",
          body: JSON.stringify({ 
            type: "order-update", 
            orderId: updated.id, 
            status: updated.status,
            tableId: updated.tableId // Essential for customer filtering
          })
        });
      }
    } catch (broadcastError) {
      console.error("[Real-Time] Failed to broadcast update:", broadcastError);
    }
    
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
