import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { admins } from '@/db/schema';
import { hash } from '@/lib/crypto/hash';
import { eq, and, gt } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json() as any;

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password required' }, { status: 400 });
    }

    const db = getDb();

    // 1. Find Admin with valid token
    const [admin] = await db.select()
      .from(admins)
      .where(
        and(
          eq(admins.resetToken, token),
          gt(admins.resetExpires, Date.now())
        )
      );

    if (!admin) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    // 2. Hash New Password
    const passwordHash = await hash(password);

    // 3. Update DB and Clear Token
    await db.update(admins)
      .set({ 
        passwordHash, 
        resetToken: null, 
        resetExpires: null 
      })
      .where(eq(admins.id, admin.id));

    return NextResponse.json({ success: true, message: 'Password updated successfully.' });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
