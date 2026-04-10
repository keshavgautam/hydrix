import { ComponentType } from 'react';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { ReactElement } from 'react';
import { useLocation } from 'react-router-dom';

export declare type FetchStrategy = "client-first" | "server-only" | "stale-while-revalidate";

export declare interface HydrateOptions {
    /**
     * "full"    — full React hydration on the server-rendered HTML (default)
     * "client"  — skip hydration, mount as fresh SPA (use when ssr.mode is "never")
     */
    mode?: "full" | "client";
    rootId?: string;
}

/**
 * Renders a route tree from a config array.
 * Client navigation uses react-router-dom and never triggers SSR.
 */
export declare function HydrixRoutes({ routes }: Pick<RouterConfig, "routes">): JSX_2.Element;

/**
 * Mount the app on the client.
 * - mode:"full"   → hydrateRoot (attaches to SSR HTML, no flash)
 * - mode:"client" → createRoot  (fresh mount, for ssr:"never" pages)
 */
export declare function mountApp(app: ReactElement, options?: HydrateOptions): void;

export declare interface RouteDefinition {
    path: string;
    component: ComponentType;
    ssr?: SSRConfig;
    children?: RouteDefinition[];
}

export declare interface RouterConfig {
    routes: RouteDefinition[];
    basename?: string;
}

export declare interface SSRConfig {
    /**
     * "always"  — render on every request (default, like Next.js SSR)
     * "once"    — render once, cache the result, serve from cache until revalidated
     * "never"   — skip SSR entirely, serve empty shell and hydrate on client
     */
    mode: SSRMode;
    /**
     * Seconds until the cached HTML is considered stale (only applies to mode: "once").
     * Omit for indefinite caching.
     */
    revalidate?: number;
}

export declare type SSRMode = "always" | "once" | "never";

export declare function useData<T = unknown>(url: string, options?: UseDataOptions<T>): UseDataResult<T>;

export declare interface UseDataOptions<T> {
    strategy?: FetchStrategy;
    /** Initial data (e.g. from SSR injection). Falls back to window.__HYDRIX_DATA__[key]. */
    initialData?: T;
    /** Dedupe identical in-flight requests */
    dedupe?: boolean;
}

export declare interface UseDataResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    revalidate: () => void;
}

export { useLocation }

/**
 * Client-side navigation hook — navigates without server round-trips.
 */
export declare function useNavigateTo(): (to: string, options?: {
    replace?: boolean;
    state?: unknown;
}) => void;

export { }
