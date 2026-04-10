// Shared types and utilities usable in both server and client contexts
export type { SSRConfig, SSRMode } from "./ssr/types.js";
export type { RouteDefinition, RouterConfig } from "./router/types.js";
export { SSRDataContext } from "./data/SSRDataContext.js";

// Client-side hooks and components
export { HydrixRoutes, useNavigateTo, useLocation } from "./router/router.js";
export { useData } from "./data/useData.js";
export type { UseDataOptions, UseDataResult, FetchStrategy } from "./data/useData.js";
export { mountApp } from "./hydration/hydrate.js";
export type { HydrateOptions } from "./hydration/hydrate.js";
