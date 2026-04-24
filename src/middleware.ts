import { NextResponse, type NextRequest } from 'next/server';
import { jwtDecrypt } from '@/lib/crypto/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip public routes and assets
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/static') || 
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/media') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api/admin/auth') ||
    pathname === '/' ||
    pathname.includes('/customer/') // Customer side is public for now
  ) {
    return NextResponse.next();
  }

  // 2. Identify Admin Routes (Pages or API)
  const isAdminPage = pathname.endsWith('/orders') || pathname.includes('/orders/') || 
                      pathname.endsWith('/menu')   || pathname.includes('/menu/')   || 
                      pathname.endsWith('/tables') || pathname.includes('/tables/');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  // 3. Verify Token
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const { data: payload, error } = await jwtDecrypt<{ 
    adminId: string; 
    tenantId: string; 
    tenantSlug: string;
  }>({
    token,
    secretKey: secret
  });

  if (error || !payload) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 4. Validate Tenant Access (if path contains tenantSlug)
  // Path format: /[tenantSlug]/orders, etc.
  const pathParts = pathname.split('/').filter(Boolean);
  if (pathParts.length > 0) {
    const requestedSlug = pathParts[0];
    // Check if the first part is a known reserved path or the tenant slug
    if (requestedSlug !== payload.tenantSlug && !['api', 'auth'].includes(requestedSlug)) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Forbidden: Cross-tenant access denied' }, { status: 403 });
      }
      return NextResponse.redirect(new URL(`/${payload.tenantSlug}/orders`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/customer (customer api)
     * - static files (_next/static, favicon, etc)
     */
    '/((?!api/customer|_next/static|_next/image|favicon.ico|media).*)',
  ],
};
