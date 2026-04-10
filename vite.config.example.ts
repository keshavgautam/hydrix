import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: resolve(__dirname, "example"),
  publicDir: false,
  build: {
    outDir: resolve(__dirname, "example/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "example/client.tsx"),
      output: {
        entryFileNames: "client.js",
        format: "es",
      },
    },
  },
  resolve: {
    alias: {
      "hydrix/server": resolve(__dirname, "src/server.ts"),
      "hydrix/client": resolve(__dirname, "src/client.ts"),
      "hydrix": resolve(__dirname, "src/index.ts"),
    },
  },
});
