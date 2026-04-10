export type SSRMode = "always" | "once" | "never";

export interface SSRConfig {
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
