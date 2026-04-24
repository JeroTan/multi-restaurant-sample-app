import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { categories, dishes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';



export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
  }
  
  const db = getDb();
  const cats = await db.select().from(categories).where(and(eq(categories.tenantId, tenantId), eq(categories.isDeleted, false)));
  const items = await db.select().from(dishes).where(and(eq(dishes.tenantId, tenantId), eq(dishes.isDeleted, false)));
  
  return NextResponse.json({ categories: cats, dishes: items });
}
