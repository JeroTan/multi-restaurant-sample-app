import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { admins } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getEnv } from '@/lib/cloudflare';

export async function POST(request: Request) {
  try {
    const { email } = await request.json() as any;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const db = getDb();

    // 1. Find Admin
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
    if (!admin) {
      // Return success even if not found for security (don't reveal registered emails)
      return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
    }

    // 2. Generate Reset Token
    const resetToken = crypto.randomUUID();
    const resetExpires = Date.now() + 3600000; // 1 hour from now

    // 3. Save to DB
    await db.update(admins)
      .set({ resetToken, resetExpires })
      .where(eq(admins.id, admin.id));

    // 4. Send Email via Resend
    const resend = new Resend(getEnv().RESEND_API_KEY);
    const origin = new URL(request.url).origin;
    const resetLink = `${origin}/auth/reset-password?token=${resetToken}`;

    const { error: emailError } = await resend.emails.send({
      from: 'QResto QR <noreply@tangramqr.com>',
      to: [email],
      subject: 'Reset your password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Hi ${admin.name},</p>
        <p>We received a request to reset your password. Click the link below to set a new one:</p>
        <a href="${resetLink}" style="display: inline-block; background: #0071e3; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Reset email sent.' });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
