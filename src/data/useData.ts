import { useState, useEffect, useRef } from "react";
import { useSSRData } from "./SSRDataContext.js";

export type FetchStrategy =
  | "client-first"       // fetch on client, skip server
  | "server-only"        // data must come from server (injected via __HYDRIX_DATA__)
  | "stale-while-revalidate"; // serve cached, revalidate in background

export interface UseDataOptions<T> {
  strategy?: FetchStrategy;
  /** Initial data (e.g. from SSR injection). Falls back to window.__HYDRIX_DATA__[key]. */
  initialData?: T;
  /** Dedupe identical in-flight requests */
  dedupe?: boolean;
}

export interface UseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  revalidate: () => void;
}

// In-flight request deduplication map
const inflight = new Map<string, Promise<unknown>>();
// SWR in-memory cache
const swrCache = new Map<string, { data: unknown; fetchedAt: number }>();

function getServerInjectedData<T>(key: string): T | undefined {
  if (typeof window === "undefined") return undefined;
  const store = (window as unknown as { __HYDRIX_DATA__?: Record<string, unknown> }).__HYDRIX_DATA__;
  return store?.[key] as T | undefined;
}

export function useData<T = unknown>(
  url: string,
  options: UseDataOptions<T> = {}
): UseDataResult<T> {
  const { strategy = "client-first", initialData, dedupe = true } = options;

  // During SSR renderToString: read from SSRDataContext (server-fetched data).
  // On the client: read from window.__HYDRIX_DATA__ injected by the server.
  const ssrContextData = useSSRData(url) as T | undefined;
  const serverData = initialData ?? ssrContextData ?? getServerInjectedData<T>(url);

  const [data, setData] = useState<T | null>(serverData ?? null);
  const [loading, setLoading] = useState(strategy !== "server-only" && !serverData);
  const [error, setError] = useState<Error | null>(null);
  const revalidateToken = useRef(0);

  async function fetchData() {
    if (strategy === "server-only") return;

    const cached = swrCache.get(url);

    if (strategy === "stale-while-revalidate" && cached) {
      setData(cached.data as T);
      setLoading(false);
      // Revalidate in background, don't set loading
    } else {
      setLoading(true);
    }

    try {
      let promise: Promise<unknown>;

      if (dedupe && inflight.has(url)) {
        promise = inflight.get(url)!;
      } else {
        promise = fetch(url).then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
          return res.json();
        });
        if (dedupe) {
          inflight.set(url, promise);
          promise.finally(() => inflight.delete(url));
        }
      }

      const result = await promise;
      swrCache.set(url, { data: result, fetchedAt: Date.now() });
      setData(result as T);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, revalidateToken.current]);

  return {
    data,
    loading,
    error,
    revalidate: () => {
      revalidateToken.current += 1;
      fetchData();
    },
  };
}
