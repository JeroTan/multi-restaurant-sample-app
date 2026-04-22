import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { tables } from '@/db/schema';
import { signTableUrl } from '@/lib/utils';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { tenantId, tableNumbers } = body as { tenantId: string, tableNumbers: string[] };
    
    if (!tenantId || !tableNumbers || !tableNumbers.length) {
      return NextResponse.json({ error: 'tenantId and tableNumbers array are required' }, { status: 400 });
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const newTables = [];
    
    for (const tableNumber of tableNumbers) {
      const qrCodeSignature = await signTableUrl(tenantId, tableNumber, secret);
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
