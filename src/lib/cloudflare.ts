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

export async function getEnvAsync(){
  return (await getCloudflareContext({async: true})).env as Env;
}