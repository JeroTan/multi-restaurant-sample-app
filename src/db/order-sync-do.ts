import { DurableObject } from "cloudflare:workers";

/**
 * OrderSync Durable Object
 * Manages WebSocket connections for a specific restaurant table.
 * When an order status changes, this DO broadcasts the update to all connected clients.
 */
export class OrderSync extends DurableObject {
  constructor(state: any, env: any) {
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

      this.ctx.acceptWebSocket(server);

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    // Intercept Notification requests from the API
    if (url.pathname === "/notify" && request.method === "POST") {
      const data = await request.json() as any;
      this.broadcast(JSON.stringify({ type: "order-update", ...data }));
      return new Response("OK");
    }

    return new Response("Not Found", { status: 404 });
  }

  broadcast(message: string) {
    // Iterate through all connected WebSockets and send the message
    const sockets = this.ctx.getWebSockets();
    sockets.forEach(s => s.send(message));
  }

  async webSocketMessage(ws: WebSocket, message: string) {
    // We don't expect messages from the customer yet, but we could handle them here.
    console.log("DO received message:", message);
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
    console.log("WebSocket closed");
  }
}
