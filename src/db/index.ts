import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  // In the Cloudflare Edge runtime (via OpenNext), bindings like D1 
  // are accessed via process.env
  const dbBinding = (process.env as unknown as Env).DB;
  
  if (!dbBinding) {
    throw new Error("D1 Database binding 'DB' is missing from env.");
  }

  return drizzle(dbBinding, { schema });
}
