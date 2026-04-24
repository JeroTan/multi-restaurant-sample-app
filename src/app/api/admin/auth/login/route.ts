import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { admins, tenants } from '@/db/schema';
import { verifyHash } from '@/lib/crypto/hash';
import { jwtEncrypt } from '@/lib/crypto/jwt';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json() as any;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const db = getDb();

    // 1. Find Admin
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 2. Verify Password
    const isValid = await verifyHash(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 3. Get Tenant Info
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, admin.tenantId));

    // 4. Generate JWT
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const { data: token, error: jwtError } = await jwtEncrypt({
      payload: { 
        adminId: admin.id, 
        tenantId: admin.tenantId,
        tenantSlug: tenant.slug
      },
      secretKey: secret,
      expiresInSeconds: 60 * 60 * 24 * 7 // 7 days
    });

    if (jwtError || !token) {
      throw new Error(jwtError || 'Failed to generate token');
    }

    // 5. Set HTTP-only Cookie
    const response = NextResponse.json({ 
      success: true, 
      admin: { id: admin.id, name: admin.name, email: admin.email },
      tenant: { slug: tenant.slug }
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
