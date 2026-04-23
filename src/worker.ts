/**
 * Custom Cloudflare Worker Entry Point
 * Wraps the OpenNext-built Next.js application and adds support for
 * Durable Objects and WebSockets.
 */

// @ts-ignore - The Next.js bundle will be located here after build
import nextWorker from "../.worker-next/index.mjs";

export { OrderSync } from "./db/order-sync-do";

export default {
  async fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url);

    // 1. Intercept WebSocket Upgrade requests for Order Tracking
    if (url.pathname === "/ws") {
      const tableId = url.searchParams.get("tableId");
      if (!tableId) return new Response("Missing tableId", { status: 400 });

      // Routing to a specific Durable Object instance per table
      const id = env.ORDER_SYNC.idFromName(tableId);
      const obj = env.ORDER_SYNC.get(id);
      
      return obj.fetch(request);
    }

    // 2. Delegate everything else to the OpenNext Next.js handler
    return nextWorker.fetch(request, env, ctx);
  }
};
