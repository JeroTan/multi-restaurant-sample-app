/**
 * Custom Cloudflare Worker Entry Point
 * Aligned with official OpenNext Cloudflare documentation:
 * https://opennext.js.org/cloudflare/howtos/custom-worker
 */

// @ts-ignore - The Next.js bundle will be located here after build
import { default as handler } from "../.open-next/worker.js";
import { OrderSync } from "./db/order-sync-do";
import { runDailyCleanup } from "./lib/tasks";
import { builder as middlewareBuilder } from "./worker-middleware";

// Durable Object class must be a named export of the worker entry point
export { OrderSync };

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // 0. Run Custom Edge Middleware
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
    // We now route by tenantId to create a unified restaurant hub
    if (url.pathname === "/ws") {
      const tenantId = url.searchParams.get("tenantId");
      if (!tenantId) return new Response("Missing tenantId", { status: 400 });

      // Routing to a specific Durable Object instance per restaurant
      const id = env.ORDER_SYNC.idFromName(tenantId);
      const obj = env.ORDER_SYNC.get(id);
      
      return obj.fetch(request);
    }

    // 2. Delegate all other traffic to the OpenNext Next.js handler
    console.log(`[Custom Worker] Delegating ${url.pathname} to OpenNext handler`);
    return handler.fetch(request, env, ctx);
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(runDailyCleanup(env));
  },
  
  OrderSync,
};
