import { getCloudflareContext } from "@opennextjs/cloudflare";
export function getEnv() {
  try {
    return getCloudflareContext().env as Env;
  } catch (e) {
    // Fallback to process.env if the adapter context isn't ready
    // This allows getEnv() to work in the custom worker entry point too
    return process.env as unknown as Env;
  }
}

/**
 * Safely retrieves a required environment variable.
 * Throws a descriptive error if the variable is missing.
 */
export function getRequiredSecret(name: keyof Env): string {
  const env = getEnv();
  const value = env[name];
  
  if (!value || typeof value !== 'string') {
    console.error(`[Environment] Missing required secret: ${name}`);
    throw new Error(`Critical Configuration Error: ${name} is not defined in the environment.`);
  }
  
  return value;
}

export async function getEnvAsync(){
  return (await getCloudflareContext({async: true})).env as Env;
}