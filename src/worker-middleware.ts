import { MiddlewareBuilder } from '@/lib/middleware/builder';
import { jwtDecrypt } from '@/lib/crypto/jwt';
import { getEnv } from '@/lib/cloudflare';

/**
 * Next.js 16 Proxy Layer
 * Ported from custom worker-middleware to align with official framework standards.
 * Note: We maintain Edge runtime compatibility for Cloudflare Worker deployment.
 */
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
    console.log(`[Proxy] Bypassing auth check for public route: ${new URL(request.url).pathname}`);
    return next();
  });

// 2. Auth Pages (Redirect if already logged in)
builder
  .path(['/auth/*'])
  .do(async (request, next, env) => {
    console.log(`[Proxy] Checking Auth Page: ${new URL(request.url).pathname}`);
    const token = getCookie(request, 'admin_token');
    
    if (token) {
      const secret = env?.JWT_SECRET || 'fallback-secret';
      const { data: payload } = await jwtDecrypt<{ tenantSlug: string }>({ token, secretKey: secret });
      
      if (payload) {
        console.log(`[Proxy] User already authenticated. Redirecting to dashboard.`);
        return Response.redirect(new URL(`/${payload.tenantSlug}/orders`, request.url).toString(), 302);
      }
    }
    
    // Allow access to login/register if not logged in
    return next();
  });

// 3. Secure Admin APIs
builder
  .path([
    '/api/admin/menu/*',
    '/api/admin/orders', '/api/admin/orders/*',
    '/api/admin/tables', '/api/admin/tables/*',
    '/api/admin/tenants', '/api/admin/tenants/*'
  ])
  .do(async (request, next, env) => {
    const url = new URL(request.url);
    console.log(`[Proxy] Securing Admin API: ${url.pathname}`);
    
    const token = getCookie(request, 'admin_token');
    if (!token) {
      console.log(`[Proxy] Blocked: No 'admin_token' cookie found.`);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const secret = env?.JWT_SECRET || 'fallback-secret';
    const { data: payload, error } = await jwtDecrypt<{ adminId: string; tenantId: string; tenantSlug: string; }>({ token, secretKey: secret });

    if (error || !payload) {
      console.log(`[Proxy] Blocked: Invalid or expired token. Error: ${error}`);
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
  .do(async (request, next, env) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    console.log(`[Proxy] Securing Admin Page: ${pathname}`);

    const token = getCookie(request, 'admin_token');
    if (!token) {
      console.log(`[Proxy] Blocked: No 'admin_token' cookie found.`);
      return Response.redirect(new URL('/auth/login', request.url).toString(), 302);
    }

    const secret = env?.JWT_SECRET || 'fallback-secret';
    const { data: payload, error } = await jwtDecrypt<{ adminId: string; tenantId: string; tenantSlug: string; }>({ token, secretKey: secret });

    if (error || !payload) {
       console.log(`[Proxy] Blocked: Invalid or expired token. Error: ${error}`);
       return Response.redirect(new URL('/auth/login', request.url).toString(), 302);
    }

    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      const requestedSlug = pathParts[0];
      if (requestedSlug !== payload.tenantSlug && !['api', 'auth'].includes(requestedSlug)) {
        console.log(`[Proxy] Blocked: Cross-tenant access denied. Redirecting to correct tenant dashboard.`);
        return Response.redirect(new URL(`/${payload.tenantSlug}/orders`, request.url).toString(), 302);
      }
    }

    return next(); // Passed Page check
  });

/**
 * Standard Next.js 16 Proxy function.
 * Note: Cloudflare Workers (via OpenNext) still require the manual call in src/worker.ts
 * to guarantee execution before standard routing logic.
 */
export async function proxy(request: Request, env?: Env): Promise<Response | null> {
    return builder.run(request, env);
}
