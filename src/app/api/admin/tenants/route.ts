import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { tenants } from '@/db/schema';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'name and slug are required' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    
    const [newTenant] = await db.insert(tenants).values({
      id,
      name: body.name,
      slug: body.slug,
      subscriptionStatus: 'active'
    }).returning();
    
    return NextResponse.json(newTenant);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
