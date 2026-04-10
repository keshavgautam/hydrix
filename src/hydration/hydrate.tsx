import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import type { ReactElement } from "react";

export interface HydrateOptions {
  /**
   * "full"    — full React hydration on the server-rendered HTML (default)
   * "client"  — skip hydration, mount as fresh SPA (use when ssr.mode is "never")
   */
  mode?: "full" | "client";
  rootId?: string;
}

/**
 * Mount the app on the client.
 * - mode:"full"   → hydrateRoot (attaches to SSR HTML, no flash)
 * - mode:"client" → createRoot  (fresh mount, for ssr:"never" pages)
 */
export function mountApp(app: ReactElement, options: HydrateOptions = {}): void {
  const { mode = "full", rootId = "root" } = options;
  const container = document.getElementById(rootId);

  if (!container) {
    throw new Error(`[hydrix] Root element #${rootId} not found`);
  }

  const wrapped = <BrowserRouter>{app}</BrowserRouter>;

  if (mode === "full") {
    hydrateRoot(container, wrapped);
  } else {
    createRoot(container).render(wrapped);
  }
}
