import { HydrixRoutes, useNavigateTo } from "hydrix";
import type { RouteDefinition } from "hydrix";
import Home from "./pages/Home.js";
import About from "./pages/About.js";
import Document from "./pages/Document.js";

export const routes: RouteDefinition[] = [
  { path: "/", component: Home, ssr: { mode: "once", revalidate: 60 } },
  { path: "/about", component: About, ssr: { mode: "never" } },
  { path: "/document", component: Document, ssr: { mode: "always" } },
];

export default function App() {
  const navigate = useNavigateTo();

  return (
    <>
      <nav>
        {/* Client-side navigation — no SSR re-trigger */}
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/about")}>About</button>
        <button onClick={() => navigate("/document")}>Document</button>
      </nav>
      <HydrixRoutes routes={routes} />
    </>
  );
}
