/**
 * Custom Cloudflare Worker Entry Point
 * Aligned with official OpenNext Cloudflare documentation:
 * https://opennext.js.org/cloudflare/howtos/custom-worker
 */

// DO NOT REMOVE THESE COMMENTS
// @ts-ignore - The Next.js bundle will be located here after build
import { default as handler } from "../.open-next/worker.js";
import { OrderSync } from "./db/order-sync-do";
import { runDailyCleanup } from "./lib/tasks";
import { builder as middlewareBuilder } from "./worker-middleware";
import { verifyTableSignature } from "./lib/crypto/signature";

// Durable Object class must be a named export of the worker entry point
export { OrderSync };

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // 0. Run Custom Edge Middleware (Bypassing Next.js 16 Node-only Proxy)
    const middlewareResponse = await middlewareBuilder.run(request, env);
    if (middlewareResponse) {
      return middlewareResponse; // The middleware decided to intercept/block/redirect
    }

    // 1. Intercept Media requests for R2 storage
    if (url.pathname.startsWith("/media/")) {
      const key = url.pathname.replace("/media/", "");
      const object = await env.ORDERING_SYSTEM_BUCKET.get(key);

      if (!object) {
        return new Response("Object Not Found", { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");

      return new Response(object.body, {
        headers,
      });
    }

    // 2. Intercept WebSocket Upgrade requests for Real-Time Order Tracking
    if (url.pathname === "/ws") {
      const tenantId = url.searchParams.get("tenantId");
      const tableNumber = url.searchParams.get("tableNumber");
      const signature = url.searchParams.get("signature");

      if (!tenantId) return new Response("Missing tenantId", { status: 400 });

      // Security: If tableNumber and signature are provided, validate them (Customer path)
      if (tableNumber && signature) {
        const secret = env.JWT_SECRET || 'fallback-secret';
        const dataToSign = `${tenantId}:${tableNumber}`;
        const isValid = await verifyTableSignature(tenantId, tableNumber, signature, secret);
        
        if (!isValid) {
          const maskedSecret = secret.length > 4 ? `${secret.substring(0, 2)}...${secret.substring(secret.length - 2)}` : '****';
          console.error(`[WS Security] Unauthorized connection attempt.`);
          console.error(`  - Table: ${tableNumber}`);
          console.error(`  - Tenant: ${tenantId}`);
          console.error(`  - Data to Sign: "${dataToSign}"`);
          console.error(`  - Secret (Masked): ${maskedSecret}`);
          console.error(`  - Received Signature: ${signature}`);
          return new Response("Unauthorized", { status: 403 });
        }
      }

      // Routing to a specific Durable Object instance per restaurant
      const id = env.ORDER_SYNC.idFromName(tenantId);
      const obj = env.ORDER_SYNC.get(id);
      
      return obj.fetch(request);
    }

    // 3. Delegate all other traffic to the OpenNext Next.js handler
    console.log(`[Custom Worker] Delegating ${url.pathname} to OpenNext handler`);
    return handler.fetch(request, env, ctx);
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(runDailyCleanup(env));
  },
  
  // Re-exporting here helps some build tools correctly identify the DO class
  OrderSync,
};
