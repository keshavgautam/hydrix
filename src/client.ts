// Client-only exports — safe to include in browser bundles
export { mountApp } from "./hydration/hydrate.js";
export type { HydrateOptions } from "./hydration/hydrate.js";
export { HydrixRoutes, useNavigateTo, useLocation } from "./router/router.js";
export { useData } from "./data/useData.js";
export type { UseDataOptions, UseDataResult, FetchStrategy } from "./data/useData.js";
export type { SSRConfig, SSRMode } from "./ssr/types.js";
export type { RouteDefinition, RouterConfig } from "./router/types.js";
