import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import type { ReactElement } from "react";
import type { RouteDefinition } from "../router/types.js";
import type { SSRConfig } from "../ssr/types.js";
import { ssrCache } from "../ssr/cache.js";
import { SSRDataContext } from "../data/SSRDataContext.js";

export interface RenderContext {
  url: string;
  routes: RouteDefinition[];
  /** Server-fetched data keyed by URL, injected into components via SSRDataContext */
  ssrData?: Record<string, unknown>;
}

export interface RenderResult {
  html: string;
  fromCache: boolean;
}

export async function renderPage(
  app: ReactElement,
  context: RenderContext,
  ssrConfig: SSRConfig = { mode: "always" }
): Promise<RenderResult> {
  const cacheKey = context.url;

  if (ssrConfig.mode === "never") {
    return { html: "", fromCache: false };
  }

  if (ssrConfig.mode === "once") {
    const cached = ssrCache.get(cacheKey);
    if (cached) return { html: cached, fromCache: true };
  }

  const html = renderToString(
    <SSRDataContext.Provider value={context.ssrData ?? {}}>
      <StaticRouter location={context.url}>{app}</StaticRouter>
    </SSRDataContext.Provider>
  );

  if (ssrConfig.mode === "once") {
    const ttl = ssrConfig.revalidate ? ssrConfig.revalidate * 1000 : undefined;
    ssrCache.set(cacheKey, html, ttl);
  }

  return { html, fromCache: false };
}

export function createHtmlDocument(
  appHtml: string,
  {
    title = "Hydrix App",
    scripts = [],
    styles = [],
    initialData = {},
  }: {
    title?: string;
    scripts?: string[];
    styles?: string[];
    initialData?: Record<string, unknown>;
  } = {}
): string {
  const scriptTags = scripts.map((s) => `<script type="module" src="${s}"></script>`).join("\n");
  const styleTags = styles.map((s) => `<link rel="stylesheet" href="${s}">`).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    ${styleTags}
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script>window.__HYDRIX_DATA__ = ${JSON.stringify(initialData)};</script>
    ${scriptTags}
  </body>
</html>`;
}
