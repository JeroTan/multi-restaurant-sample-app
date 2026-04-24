import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { dishes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';



export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  const categoryId = searchParams.get('categoryId');
  
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
  }
  
  const db = getDb();
  
  const conditions = [eq(dishes.tenantId, tenantId), eq(dishes.isDeleted, false)];
  if (categoryId) conditions.push(eq(dishes.categoryId, categoryId));
  
  const data = await db.select().from(dishes).where(and(...conditions));
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json() as any;
    const { tenantId, categoryId, name, description, price, imageUrl } = body;
    
    if (!tenantId || !categoryId || !name || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [newDish] = await db.insert(dishes).values({
      id: crypto.randomUUID(),
      tenantId,
      categoryId,
      name,
      description,
      price,
      imageUrl,
      isSoldOut: false
    }).returning();
    
    return NextResponse.json(newDish);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
