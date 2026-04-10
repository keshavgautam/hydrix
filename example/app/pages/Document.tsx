import { useData } from "hydrix";

// SSR behavior on server env: rendered on every request with server-fetched data
// SPA behavior from browser env: client navigates without full reload, data served from __HYDRIX_DATA__ then revalidated
export const ssr = {
  mode: "always" as const,
};

const DOC_API = "https://prod.onlinelocalstore.com/plugins/cms/get-document/6914e72c2ed6929a020fd182";

interface DocumentData {
  [key: string]: unknown;
}

export default function Document() {
  const { data, loading, error } = useData<DocumentData>(DOC_API, {
    // On first render: reads server-injected __HYDRIX_DATA__[DOC_API] (from SSR)
    // On client navigation: fetches fresh from API
    strategy: "stale-while-revalidate",
  });

  return (
    <main>
      <h1>Document</h1>
      <p>SSR on server &mdash; SPA navigation on client.</p>
      {loading && <p>Loading document...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <pre style={{ background: "#f4f4f4", padding: "1rem", overflow: "auto" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  );
}
