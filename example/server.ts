import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createElement } from "react";
import { renderPage, createHtmlDocument } from "hydrix/server";
import App, { routes } from "./app/App.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME: Record<string, string> = {
  ".js":  "application/javascript",
  ".css": "text/css",
  ".map": "application/json",
};

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  const url = req.url ?? "/";

  // Serve static assets from example/public/
  if (url.startsWith("/") && path.extname(url)) {
    const filePath = path.join(PUBLIC_DIR, url);
    const ext = path.extname(url);
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { "Content-Type": MIME[ext] ?? "text/plain" });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  // Simple API endpoint
  if (url === "/api/hello") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Hello from Hydrix!" }));
    return;
  }

  // Find the matching route config to get its SSR settings
  const matchedRoute = routes.find((r) => r.path === url) ?? routes[0];
  const ssrConfig = matchedRoute.ssr ?? { mode: "always" };

  // For the /document route, pre-fetch data server-side and inject via __HYDRIX_DATA__
  // so the client gets real content on first paint (SSR data injection).
  // On subsequent client-side navigations, the browser fetches directly (SPA behavior).
  const initialData: Record<string, unknown> = {};
  if (url === "/document") {
    const DOC_API = "https://prod.onlinelocalstore.com/plugins/cms/get-document/6914e72c2ed6929a020fd182";
    try {
      const apiRes = await fetch(DOC_API);
      if (apiRes.ok) {
        initialData[DOC_API] = await apiRes.json();
      }
    } catch {
      // Server fetch failed — client will fetch on hydration
    }
  }

  const { html, fromCache } = await renderPage(
    createElement(App),
    { url, routes, ssrData: initialData },
    ssrConfig
  );

  const document = createHtmlDocument(html, {
    title: "Hydrix App",
    scripts: ["/client.js"],
    initialData,
  });

  res.writeHead(200, {
    "Content-Type": "text/html",
    "X-Hydrix-Cache": fromCache ? "HIT" : "MISS",
  });
  res.end(document);
});

server.listen(PORT, () => {
  console.log(`Hydrix example running at http://localhost:${PORT}`);
});
