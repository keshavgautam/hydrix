# SSR Data Injection

Hydrix supports server-side data fetching that renders into the initial HTML string — so the client receives real content on first paint, not a loading skeleton.

---

## How It Works

### The Problem

During `renderToString`, React runs synchronously. `useEffect` never fires, and `window` is undefined — so `useData` has no way to access fetched data. Without intervention, the SSR HTML always renders the loading state.

### The Solution

A React context (`SSRDataContext`) is populated with server-fetched data before `renderToString` runs. `useData` reads from this context during SSR, so components render with real data in the HTML string.

On the client, the same data is injected into `window.__HYDRIX_DATA__` so React hydration matches the server-rendered HTML without a flash.

---

## Data Flow

```
Server request
  │
  ├─ Fetch data from external API        (example/server.ts)
  │
  ├─ Pass data to renderPage()           { ssrData: { [url]: data } }
  │
  ├─ Wrap render tree with context       <SSRDataContext.Provider value={ssrData}>
  │
  ├─ renderToString runs
  │     └─ useData reads SSRDataContext  → renders real content in HTML
  │
  ├─ Inject into window.__HYDRIX_DATA__  (createHtmlDocument initialData)
  │
  └─ Send HTML to browser
        └─ Client hydrates               useData reads __HYDRIX_DATA__ → no flash
              └─ SPA navigation          useData fetches directly from API
```

---

## Files Involved

| File | Role |
|------|------|
| `src/data/SSRDataContext.ts` | React context holding `url → data` map during SSR |
| `src/renderer/renderer.tsx` | Wraps render with `SSRDataContext.Provider` |
| `src/data/useData.ts` | Reads context (server) or `__HYDRIX_DATA__` (client) |
| `example/server.ts` | Fetches API data, passes to `renderPage` and `createHtmlDocument` |
| `example/app/pages/Document.tsx` | Example page using this pattern |

---

## API

### `renderPage(app, context, ssrConfig)`

`context` now accepts an optional `ssrData` field:

```ts
interface RenderContext {
  url: string;
  routes: RouteDefinition[];
  ssrData?: Record<string, unknown>; // keyed by URL
}
```

### `useSSRData(url)`

Internal hook used by `useData`. Returns data from `SSRDataContext` during SSR, `undefined` on the client.

### `useData(url, options)`

Priority order for initial data:

1. `options.initialData` (explicit prop)
2. `SSRDataContext[url]` (server context — SSR only)
3. `window.__HYDRIX_DATA__[url]` (client hydration)
4. `null` (triggers client fetch)

---

## Usage

### 1. Fetch data in `server.ts` and pass to `renderPage`

```ts
const initialData: Record<string, unknown> = {};

if (url === "/document") {
  const res = await fetch("https://example.com/api/document");
  if (res.ok) initialData["https://example.com/api/document"] = await res.json();
}

const { html } = await renderPage(
  createElement(App),
  { url, routes, ssrData: initialData }, // <-- pass here
  ssrConfig
);

const document = createHtmlDocument(html, {
  scripts: ["/client.js"],
  initialData, // <-- also inject for client hydration
});
```

### 2. Set SSR mode in the page

```ts
// example/app/pages/Document.tsx
export const ssr = {
  mode: "always" as const, // render on every server request
};
```

### 3. Use `useData` with `stale-while-revalidate`

```ts
const { data, loading, error } = useData<MyType>(API_URL, {
  strategy: "stale-while-revalidate",
  // SSR:    reads from SSRDataContext → renders in HTML
  // Client: reads from __HYDRIX_DATA__ → no flash on hydration
  //         then revalidates in background (SPA behavior)
});
```

---

## SSR Modes and Data Behavior

| SSR Mode | Server renders data | Client behavior |
|----------|--------------------|--------------------|
| `always` | Yes, on every request | Hydrates from `__HYDRIX_DATA__`, then SWR revalidates |
| `once` | Yes, cached | Same as above; cache served until TTL expires |
| `never` | No | Client fetches on mount (pure SPA) |

---

## Notes

- The `ssrData` key must match exactly the URL string passed to `useData`. Both must use the same full URL.
- If the server-side fetch fails, the component falls back gracefully — `useData` will fetch on the client after hydration.
- `SSRDataContext` is only populated during `renderToString`. On the client, `useContext(SSRDataContext)` returns `null`, so there is no runtime overhead.
