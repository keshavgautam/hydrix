import { ComponentType } from 'react';
import { Context } from 'react';
import { ReactElement } from 'react';

export declare function createHtmlDocument(appHtml: string, { title, scripts, styles, initialData, }?: {
    title?: string;
    scripts?: string[];
    styles?: string[];
    initialData?: Record<string, unknown>;
}): string;

export declare interface RenderContext {
    url: string;
    routes: RouteDefinition[];
    /** Server-fetched data keyed by URL, injected into components via SSRDataContext */
    ssrData?: Record<string, unknown>;
}

export declare function renderPage(app: ReactElement, context: RenderContext, ssrConfig?: SSRConfig): Promise<RenderResult>;

export declare interface RenderResult {
    html: string;
    fromCache: boolean;
}

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

declare class SSRCache {
    private store;
    get(key: string): string | null;
    set(key: string, html: string, ttlMs?: number): void;
    invalidate(key: string): void;
    invalidateAll(): void;
    size(): number;
}

export declare const ssrCache: SSRCache;

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

export declare const SSRDataContext: Context<Record<string, unknown> | null>;

export declare type SSRMode = "always" | "once" | "never";

export { }
