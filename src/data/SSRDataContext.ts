import { createContext, useContext } from "react";

// Holds server-fetched data keyed by URL during SSR renderToString.
// On the client this context is never provided, so useContext returns null.
export const SSRDataContext = createContext<Record<string, unknown> | null>(null);

export function useSSRData(url: string): unknown | undefined {
  const ctx = useContext(SSRDataContext);
  return ctx?.[url];
}
