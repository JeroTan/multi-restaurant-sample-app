import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { tables } from '@/db/schema';
import { signTableSignature } from '@/lib/crypto/signature';
import { eq, asc } from 'drizzle-orm';
import { getRequiredSecret } from '@/lib/cloudflare';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    
    if (!tenantId) {
      return NextResponse.json({ error: 'tenantId is required' }, { status: 400 });
    }
    
    const db = getDb();
    const allTables = await db.select().from(tables).where(eq(tables.tenantId, tenantId)).orderBy(asc(tables.tableNumber));
    
    return NextResponse.json(allTables);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { tenantId, tableNumbers } = body as { tenantId: string, tableNumbers: string[] };
    
    if (!tenantId || !tableNumbers || !tableNumbers.length) {
      return NextResponse.json({ error: 'tenantId and tableNumbers array are required' }, { status: 400 });
    }

    const secret = getRequiredSecret('JWT_SECRET');
    const newTables = [];
    
    for (const tableNumber of tableNumbers) {
      const qrCodeSignature = await signTableSignature(tenantId, tableNumber, secret);
      const id = crypto.randomUUID();
      
      const [newTable] = await db.insert(tables).values({
        id,
        tenantId,
        tableNumber,
        qrCodeSignature
      }).returning();
      
      newTables.push(newTable);
    }
    
    return NextResponse.json(newTables);
  } catch (error: any) {
    console.error("[Admin Tables API] Error creating tables:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
