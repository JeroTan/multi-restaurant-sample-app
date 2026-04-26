import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { categories, dishes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = params.id;
    const body = await request.json() as any;
    const { tenantId, ...updateData } = body;

    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
    }

    const db = getDb();
    const [updatedCat] = await db
      .update(categories)
      .set(updateData)
      .where(and(eq(categories.id, id), eq(categories.tenantId, tenantId)))
      .returning();

    if (!updatedCat) {
      return NextResponse.json({ error: 'Category not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(updatedCat);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = params.id;
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
    }

    const db = getDb();
    
    // 1. Soft delete the category
    const [deletedCat] = await db
      .update(categories)
      .set({ isDeleted: true })
      .where(and(eq(categories.id, id), eq(categories.tenantId, tenantId)))
      .returning();

    if (!deletedCat) {
      return NextResponse.json({ error: 'Category not found or unauthorized' }, { status: 404 });
    }

    // 2. Cascade soft-delete all dishes in this category
    await db
      .update(dishes)
      .set({ isDeleted: true })
      .where(and(eq(dishes.categoryId, id), eq(dishes.tenantId, tenantId)));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
