import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { dishes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json() as any;
    const { tenantId, ...updateData } = body;

    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
    }

    const db = getDb();
    const [updatedDish] = await db
      .update(dishes)
      .set(updateData)
      .where(and(eq(dishes.id, id), eq(dishes.tenantId, tenantId)))
      .returning();

    if (!updatedDish) {
      return NextResponse.json({ error: 'Dish not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(updatedDish);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
    }

    const db = getDb();
    const [deletedDish] = await db
      .update(dishes)
      .set({ isDeleted: true })
      .where(and(eq(dishes.id, id), eq(dishes.tenantId, tenantId)))
      .returning();

    if (!deletedDish) {
      return NextResponse.json({ error: 'Dish not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
