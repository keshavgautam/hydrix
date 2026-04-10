# hydrix

Fine-grained SSR for React. Control server rendering per route — render `once`, `always`, or `never`.

```
npm install hydrix
```

---

## How it works

Most SSR frameworks apply one render strategy to the whole app. Hydrix lets you choose per route:

| Mode | Behavior |
|------|----------|
| `always` | Render on every server request (like Next.js SSR) |
| `once` | Render once, cache until TTL expires |
| `never` | Skip SSR, serve empty shell and hydrate on client |

Client navigation is always SPA — no server round-trips regardless of mode.

---

## Quick start

### 1. Define routes

```tsx
// app/App.tsx
import { HydrixRoutes, useNavigateTo } from "hydrix";
import type { RouteDefinition } from "hydrix";
import Home from "./pages/Home";
import About from "./pages/About";

export const routes: RouteDefinition[] = [
  { path: "/",      component: Home,  ssr: { mode: "once", revalidate: 60 } },
  { path: "/about", component: About, ssr: { mode: "never" } },
];

export default function App() {
  const navigate = useNavigateTo();
  return (
    <>
      <nav>
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/about")}>About</button>
      </nav>
      <HydrixRoutes routes={routes} />
    </>
  );
}
```

### 2. Mount on the client

```tsx
// client.tsx
import { mountApp } from "hydrix";
import App from "./app/App";

mountApp(<App />, { mode: "full" });
```

### 3. Render on the server

```ts
// server.ts
import { createElement } from "react";
import { renderPage, createHtmlDocument } from "hydrix/server";
import App, { routes } from "./app/App";

const matchedRoute = routes.find(r => r.path === url) ?? routes[0];
const { html } = await renderPage(createElement(App), { url, routes }, matchedRoute.ssr);

const document = createHtmlDocument(html, { scripts: ["/client.js"] });
res.end(document);
```

---

## SSR modes

```ts
// once — render once and cache (revalidate after 60s)
export const ssr = { mode: "once" as const, revalidate: 60 };

// always — render fresh on every request
export const ssr = { mode: "always" as const };

// never — client-only, no server rendering
export const ssr = { mode: "never" as const };
```

---

## Data fetching

### `useData(url, options)`

Fetches data with built-in deduplication and SWR support.

```tsx
import { useData } from "hydrix";

function MyPage() {
  const { data, loading, error, revalidate } = useData<MyType>("/api/data", {
    strategy: "stale-while-revalidate", // "client-first" | "server-only" | "stale-while-revalidate"
  });

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error.message}</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

| Strategy | Behavior |
|----------|----------|
| `client-first` | Fetch on client only (default) |
| `server-only` | Read from server-injected `__HYDRIX_DATA__`, never refetch |
| `stale-while-revalidate` | Serve cached/injected data immediately, revalidate in background |

### Server-side data injection

Pre-fetch data on the server so the SSR HTML contains real content — no loading flash.

```ts
// server.ts
const initialData: Record<string, unknown> = {};

if (url === "/document") {
  const res = await fetch("https://api.example.com/document");
  if (res.ok) initialData["https://api.example.com/document"] = await res.json();
}

const { html } = await renderPage(
  createElement(App),
  { url, routes, ssrData: initialData }, // injected into SSRDataContext during renderToString
  ssrConfig
);

const document = createHtmlDocument(html, {
  scripts: ["/client.js"],
  initialData, // injected into window.__HYDRIX_DATA__ for hydration
});
```

In your component, the URL key must match exactly:

```tsx
const { data } = useData<MyType>("https://api.example.com/document", {
  strategy: "stale-while-revalidate",
});
```

---

## API reference

### `hydrix` (shared / isomorphic)

| Export | Description |
|--------|-------------|
| `HydrixRoutes` | Route renderer component |
| `useNavigateTo()` | Client-side navigation hook |
| `useLocation()` | Current location hook (re-exported from react-router-dom) |
| `useData(url, options)` | Data fetching hook with SSR support |
| `mountApp(app, options)` | Mount or hydrate the app on the client |
| `SSRDataContext` | React context for server-side data injection |
| `RouteDefinition` | Route config type |
| `SSRConfig` / `SSRMode` | SSR config types |

### `hydrix/server`

| Export | Description |
|--------|-------------|
| `renderPage(app, context, ssrConfig)` | Render app to HTML string |
| `createHtmlDocument(html, options)` | Wrap HTML in a full document |
| `ssrCache` | SSR HTML cache (get / set / invalidate) |
| `SSRDataContext` | Same context, re-exported for custom server setups |

### `renderPage` context

```ts
interface RenderContext {
  url: string;
  routes: RouteDefinition[];
  ssrData?: Record<string, unknown>; // keyed by URL — fed into components via SSRDataContext
}
```

### `createHtmlDocument` options

```ts
{
  title?: string;
  scripts?: string[];
  styles?: string[];
  initialData?: Record<string, unknown>; // becomes window.__HYDRIX_DATA__
}
```

### `mountApp` options

```ts
{
  mode?: "full"   // hydrateRoot — attach to SSR HTML (default)
       | "client" // createRoot  — fresh mount, for ssr: "never" pages
  rootId?: string // default: "root"
}
```

---

## Requirements

- React 18+
- Node.js 18+

---

## License

MIT
