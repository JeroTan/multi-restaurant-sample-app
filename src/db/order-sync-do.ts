import { DurableObject } from "cloudflare:workers";

/**
 * OrderSync Durable Object (Tenant Hub)
 * Manages WebSocket connections for a specific restaurant (tenant).
 * Broadcasts events like "new-order" and "order-update" to all connected
 * staff (admins) and customers.
 */
export class OrderSync extends DurableObject {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  async fetch(request: Request) {
    const url = new URL(request.url);
    
    // Intercept WebSocket upgrade requests
    if (url.pathname === "/ws") {
      const upgradeHeader = request.headers.get("Upgrade");
      if (!upgradeHeader || upgradeHeader !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
      }

      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);

      // Store the connection in the DO context
      this.ctx.acceptWebSocket(server);

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    // Intercept Notification requests from the API
    if (url.pathname === "/notify" && request.method === "POST") {
      const data = await request.json() as any;
      // Broadcast the event to all subscribers in this tenant hub
      this.broadcast(JSON.stringify(data));
      return new Response("OK");
    }

    return new Response("Not Found", { status: 404 });
  }

  broadcast(message: string) {
    const sockets = this.ctx.getWebSockets();
    sockets.forEach(s => {
      try {
        s.send(message);
      } catch (e) {
        // Handle potentially closed sockets gracefully
      }
    });
  }

  async webSocketMessage(ws: WebSocket, message: string) {
    // Optional: handle client-to-server messages
    console.log("DO received message:", message);
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
    console.log("WebSocket closed");
  }
}
