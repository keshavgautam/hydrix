import { useData } from "hydrix";

// SSR config for this page — rendered once, cached for 60s
export const ssr = {
  mode: "once" as const,
  revalidate: 60,
};

export default function Home() {
  const { data, loading, error } = useData<{ message: string }>("/api/hello", {
    strategy: "stale-while-revalidate",
  });

  return (
    <main>
      <h1>Hydrix</h1>
      <p>Fine-grained SSR for React.</p>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>API: {data.message}</p>}
    </main>
  );
}
