import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { admins, tenants } from '@/db/schema';
import { hash } from '@/lib/crypto/hash';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { name, email, password, restaurantName } = await request.json() as any;

    if (!name || !email || !password || !restaurantName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();

    // 1. Check if user already exists
    const [existingUser] = await db.select().from(admins).where(eq(admins.email, email));
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // 2. Create Tenant
    const slug = restaurantName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.floor(Math.random() * 1000);
    const [newTenant] = await db.insert(tenants).values({
      id: crypto.randomUUID(),
      name: restaurantName,
      slug,
    }).returning();

    // 3. Hash Password
    const passwordHash = await hash(password);

    // 4. Create Admin
    const [newAdmin] = await db.insert(admins).values({
      id: crypto.randomUUID(),
      tenantId: newTenant.id,
      name,
      email,
      passwordHash,
    }).returning();

    return NextResponse.json({ 
      success: true, 
      admin: { id: newAdmin.id, name: newAdmin.name, email: newAdmin.email },
      tenant: { id: newTenant.id, slug: newTenant.slug }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
