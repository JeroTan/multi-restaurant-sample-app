/**
 * Table URL Signature Utility
 * Uses Web Crypto API for Cloudflare Worker compatibility.
 * Centralizes HMAC generation and verification for table-specific requests.
 */

/**
 * Generates an HMAC signature for a table URL.
 * @param tenantId The unique ID of the restaurant
 * @param tableNumber The table number
 * @param secret The secret key for signing (JWT_SECRET)
 */
export async function signTableSignature(tenantId: string, tableNumber: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret.trim());
  
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  // Ensure consistent data format by trimming and lowercasing if necessary
  // For now, we just trim to avoid obvious whitespace issues
  const data = encoder.encode(`${tenantId.trim()}:${tableNumber.trim()}`);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
  
  // Base64Url encoding
  return btoa(String.fromCharCode(...Array.from(new Uint8Array(signatureBuffer))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Verifies if a provided signature matches the expected signature for a table.
 * @param tenantId The unique ID of the restaurant
 * @param tableNumber The table number
 * @param signature The signature to verify
 * @param secret The secret key for signing (JWT_SECRET)
 */
export async function verifyTableSignature(tenantId: string, tableNumber: string, signature: string, secret: string): Promise<boolean> {
  try {
    const expected = await signTableSignature(tenantId, tableNumber, secret);
    return signature === expected;
  } catch (e) {
    console.error("[Signature] Verification failed due to error:", e);
    return false;
  }
}
