import { MiddlewareBuilder } from '@/lib/middleware/builder';
import { jwtDecrypt } from '@/lib/crypto/jwt';

export const builder = new MiddlewareBuilder();

function getCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName.trim() === name) return cookieValue.trim();
  }
  return null;
}

// 1. Skip public assets and basic customer routes
builder
  .path([
    '/_next/*',
    '/static/*',
    '/favicon.ico',
    '/media/*',
    '/',
    '*/customer/*',
    '/api/customer/*',
    '/api/admin/auth/*' // Explicitly skip auth APIs
  ])
  .do((request, next) => {
    console.log(`[Worker Middleware] Bypassing auth check for public route: ${new URL(request.url).pathname}`);
    return next();
  });

// 2. Auth Pages (Redirect if already logged in)
builder
  .path(['/auth/*'])
  .do(async (request, next) => {
    console.log(`[Worker Middleware] Checking Auth Page: ${new URL(request.url).pathname}`);
    const token = getCookie(request, 'admin_token');
    
    if (token) {
      const secret = process.env.JWT_SECRET || 'fallback-secret';
      const { data: payload } = await jwtDecrypt<{ tenantSlug: string }>({ token, secretKey: secret });
      
      if (payload) {
        console.log(`[Worker Middleware] User already authenticated. Redirecting to dashboard.`);
        return Response.redirect(new URL(`/${payload.tenantSlug}/orders`, request.url).toString(), 302);
      }
    }
    
    // Allow access to login/register if not logged in
    return next();
  });

// 3. Secure Admin APIs
// We explicitly define the secure APIs to avoid accidentally catching /api/admin/auth/*
builder
  .path([
    '/api/admin/menu/*',
    '/api/admin/orders', '/api/admin/orders/*',
    '/api/admin/tables', '/api/admin/tables/*',
    '/api/admin/tenants', '/api/admin/tenants/*'
  ])
  .do(async (request, next) => {
    const url = new URL(request.url);
    console.log(`[Worker Middleware] Securing Admin API: ${url.pathname}`);
    
    const token = getCookie(request, 'admin_token');
    if (!token) {
      console.log(`[Worker Middleware] Blocked: No 'admin_token' cookie found.`);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const { data: payload, error } = await jwtDecrypt<{ adminId: string; tenantId: string; tenantSlug: string; }>({ token, secretKey: secret });

    if (error || !payload) {
      console.log(`[Worker Middleware] Blocked: Invalid or expired token. Error: ${error}`);
      return new Response(JSON.stringify({ error: 'Invalid or expired session' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    return next(); // Passed API check
  });

// 4. Secure Admin Pages
builder
  .path([
    '*/orders', '*/orders/*',
    '*/menu',   '*/menu/*',
    '*/tables', '*/tables/*'
  ])
  .do(async (request, next) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    console.log(`[Worker Middleware] Securing Admin Page: ${pathname}`);

    const token = getCookie(request, 'admin_token');
    if (!token) {
      console.log(`[Worker Middleware] Blocked: No 'admin_token' cookie found.`);
      return Response.redirect(new URL('/auth/login', request.url).toString(), 302);
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const { data: payload, error } = await jwtDecrypt<{ adminId: string; tenantId: string; tenantSlug: string; }>({ token, secretKey: secret });

    if (error || !payload) {
       console.log(`[Worker Middleware] Blocked: Invalid or expired token. Error: ${error}`);
       return Response.redirect(new URL('/auth/login', request.url).toString(), 302);
    }

    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      const requestedSlug = pathParts[0];
      if (requestedSlug !== payload.tenantSlug && !['api', 'auth'].includes(requestedSlug)) {
        console.log(`[Worker Middleware] Blocked: Cross-tenant access denied. Redirecting to correct tenant dashboard.`);
        return Response.redirect(new URL(`/${payload.tenantSlug}/orders`, request.url).toString(), 302);
      }
    }

    return next(); // Passed Page check
  });
