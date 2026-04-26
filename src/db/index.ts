import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { getEnv } from "@/lib/cloudflare";

export function getDb() {
  // Access the environment bindings via the centralized getEnv utility
  const dbBinding = getEnv().DB;
  
  if (!dbBinding) {
    throw new Error("D1 Database binding 'DB' is missing from env.");
  }

  return drizzle(dbBinding, { schema });
}
