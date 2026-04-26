import { RouteConfig, MiddlewareHandler, NextFunction } from './types';

const matchPattern = (pathname: string, pattern: string) => {
  const escaped = pattern
    .split('*')
    .map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  
  const regex = new RegExp(`^${escaped}$`);
  return regex.test(pathname);
};

export class RouteBuilder {
  private config: RouteConfig;

  constructor(patterns: string[], private parent: MiddlewareBuilder) {
    this.config = { patterns, handlers: [] };
    parent.addRoute(this.config);
  }

  method(methods: string[]) {
    this.config.methods = methods.map((m) => m.toUpperCase());
    return this;
  }

  do(handler: MiddlewareHandler) {
    this.config.handlers.push(handler);
    return this;
  }
}

export class MiddlewareBuilder {
  private routes: RouteConfig[] = [];

  path(patterns: string[]) {
    return new RouteBuilder(patterns, this);
  }

  addRoute(config: RouteConfig) {
    this.routes.push(config);
  }

  async run(request: Request): Promise<Response | null> {
    const next: NextFunction = () => {};
    const url = new URL(request.url);
    const pathname = url.pathname;

    console.log(`\n[Middleware Builder] >>> Starting request for: ${request.method} ${pathname}`);

    for (let i = 0; i < this.routes.length; i++) {
      const route = this.routes[i];

      if (route.methods && !route.methods.includes(request.method)) {
        continue;
      }

      let matchedPattern = null;
      for (const pattern of route.patterns) {
        if (matchPattern(pathname, pattern)) {
          matchedPattern = pattern;
          break;
        }
      }

      if (!matchedPattern) continue;

      console.log(`[Middleware Builder] Matched route block #${i} with pattern: "${matchedPattern}"`);

      for (const handler of route.handlers) {
        const result = await handler(request, next);

        if (result instanceof Response) {
          console.log(`[Middleware Builder] Handler returned a Response. Aborting chain.`);
          return result;
        }
      }
      
      console.log(`[Middleware Builder] All handlers in block #${i} allowed request. Continuing to next route block...`);
    }

    console.log(`[Middleware Builder] End of chain, proceeding to Next.js handler.`);
    return null; // Return null so the main worker knows to continue to Next.js
  }
}
