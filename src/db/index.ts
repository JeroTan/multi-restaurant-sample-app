import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  // In the Cloudflare Edge runtime (via OpenNext), bindings like D1 
  // are often injected into process.env. We cast it to the expected D1Database type.
  const dbBinding = process.env.DB as unknown as D1Database;
  
  if (!dbBinding) {
    throw new Error("D1 Database binding 'DB' is missing from process.env.");
  }

  return drizzle(dbBinding, { schema });
}
