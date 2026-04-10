// ssr.mode "never" — this page is client-only, no server rendering
export const ssr = {
  mode: "never" as const,
};

export default function About() {
  return (
    <main>
      <h1>About</h1>
      <p>This page is never server-rendered (client SPA only).</p>
    </main>
  );
}
