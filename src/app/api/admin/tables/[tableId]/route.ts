import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { tables } from '@/db/schema';
import { signTableSignature } from '@/lib/crypto/signature';
import { eq, and } from 'drizzle-orm';
import { getRequiredSecret } from '@/lib/cloudflare';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tableId: string }> }
) {
  try {
    const { tableId } = await params;
    const body = await request.json();
    const { tenantId, tableNumber } = body as { tenantId: string, tableNumber: string };

    if (!tenantId || !tableNumber) {
      return NextResponse.json({ error: 'tenantId and tableNumber are required' }, { status: 400 });
    }

    const secret = getRequiredSecret('JWT_SECRET');
    const qrCodeSignature = await signTableSignature(tenantId, tableNumber, secret);

    const db = getDb();
    const [updatedTable] = await db.update(tables)
      .set({ 
        tableNumber, 
        qrCodeSignature 
      })
      .where(and(
        eq(tables.id, tableId),
        eq(tables.tenantId, tenantId)
      ))
      .returning();

    if (!updatedTable) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTable);
  } catch (error: any) {
    console.error("[Admin Table PATCH API] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tableId: string }> }
) {
  try {
    const { tableId } = await params;
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
    }

    const db = getDb();
    const [deletedTable] = await db.update(tables)
      .set({ isDeleted: true })
      .where(and(
        eq(tables.id, tableId),
        eq(tables.tenantId, tenantId)
      ))
      .returning();

    if (!deletedTable) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Admin Table DELETE API] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}