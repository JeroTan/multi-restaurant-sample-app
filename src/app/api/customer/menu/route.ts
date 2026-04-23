import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { categories, dishes } from '@/db/schema';
import { eq } from 'drizzle-orm';



export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
  }
  
  const db = getDb();
  const cats = await db.select().from(categories).where(eq(categories.tenantId, tenantId));
  const items = await db.select().from(dishes).where(eq(dishes.tenantId, tenantId));
  
  return NextResponse.json({ categories: cats, dishes: items });
}
