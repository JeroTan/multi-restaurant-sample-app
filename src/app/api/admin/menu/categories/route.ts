import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
  }
  
  const db = getDb();
  const data = await db.select().from(categories).where(eq(categories.tenantId, tenantId));
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { tenantId, name, order } = body;
    
    if (!tenantId || !name) {
      return NextResponse.json({ error: 'tenantId and name required' }, { status: 400 });
    }

    const [newCat] = await db.insert(categories).values({
      id: crypto.randomUUID(),
      tenantId,
      name,
      order: order || 0
    }).returning();
    
    return NextResponse.json(newCat);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
