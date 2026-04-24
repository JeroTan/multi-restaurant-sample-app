import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // In OpenNext/Cloudflare, we access the env via process.env
    const bucket = (process.env as any).ORDERING_SYSTEM_BUCKET;
    
    if (!bucket) {
      return NextResponse.json({ error: 'R2 Bucket binding missing' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tenantId = formData.get('tenantId') as string;

    if (!file || !tenantId) {
      return NextResponse.json({ error: 'Missing file or tenantId' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const extension = file.name.split('.').pop();
    const filename = `${tenantId}/${crypto.randomUUID()}.${extension}`;

    await bucket.put(filename, buffer, {
      httpMetadata: { contentType: file.type },
    });

    return NextResponse.json({ 
      url: `/media/${filename}`,
      filename 
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
