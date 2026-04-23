/**
 * Custom Cloudflare Worker Entry Point
 * Aligned with official OpenNext Cloudflare documentation:
 * https://opennext.js.org/cloudflare/howtos/custom-worker
 */

// @ts-ignore - The Next.js bundle will be located here after build
import { default as handler } from "../.worker-next/index.mjs";
import { OrderSync } from "./db/order-sync-do";

// Durable Object class must be a named export of the worker entry point
export { OrderSync };

export default {
  async fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url);

    // 1. Intercept WebSocket Upgrade requests for Real-Time Order Tracking
    if (url.pathname === "/ws") {
      const tableId = url.searchParams.get("tableId");
      if (!tableId) return new Response("Missing tableId", { status: 400 });

      // Routing to a specific Durable Object instance per table
      const id = env.ORDER_SYNC.idFromName(tableId);
      const obj = env.ORDER_SYNC.get(id);
      
      return obj.fetch(request);
    }

    // 2. Delegate all other traffic to the OpenNext Next.js handler
    return handler.fetch(request, env, ctx);
  },
  
  // Including OrderSync in the default export object as well, 
  // following the documentation's pattern.
  OrderSync,
};
