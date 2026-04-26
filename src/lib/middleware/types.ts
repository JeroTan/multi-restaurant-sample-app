export type NextFunction = () => void;

export type MiddlewareResult = Response | void;

export type MiddlewareHandler = (
  req: Request,
  next: NextFunction,
  env?: Env
) => Promise<MiddlewareResult> | MiddlewareResult;

export interface RouteConfig {
  patterns: string[];
  methods?: string[];
  handlers: MiddlewareHandler[];
}

