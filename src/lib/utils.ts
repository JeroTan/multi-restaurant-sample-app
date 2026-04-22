import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates an HMAC signature for a table URL to prevent forgery.
 * @param tenantId The unique ID of the restaurant
 * @param tableNumber The table number
 * @param secret The secret key for signing
 */
export async function signTableUrl(tenantId: string, tableNumber: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const data = encoder.encode(`${tenantId}:${tableNumber}`);
  const signature = await crypto.subtle.sign("HMAC", key, data);
  
  return btoa(String.fromCharCode(...Array.from(new Uint8Array(signature))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
