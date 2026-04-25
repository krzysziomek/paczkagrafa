// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import type { Plugin } from "vite";

/**
 * Plugin: nasłuchuje public/pliki/** i regeneruje src/data/files-manifest.json
 * przez `node scripts/build-manifest.mjs`. Po zapisie manifestu Vite
 * automatycznie odpali HMR (bo files.ts importuje JSON), więc UI się odświeży
 * bez ręcznego restartu.
 */
function autoManifestPlugin(): Plugin {
  let regenTimer: NodeJS.Timeout | null = null;
  const root = process.cwd();

  function regenerate() {
    if (regenTimer) clearTimeout(regenTimer);
    regenTimer = setTimeout(() => {
      const child = spawn("node", ["scripts/build-manifest.mjs"], {
        cwd: root,
        stdio: "inherit",
      });
      child.on("error", (err) => {
        console.error("[auto-manifest] błąd:", err);
      });
    }, 150); // debounce — wiele zmian w jednym tiku scali do 1 regenu
  }

  return {
    name: "paczka-grafa:auto-manifest",
    apply: "serve", // tylko dev
    configureServer(server) {
      const watchDir = resolve(root, "public/pliki");
      server.watcher.add(watchDir);
      const handler = (path: string) => {
        if (!path.includes("/public/pliki/")) return;
        if (!path.toLowerCase().endsWith(".zip")) return;
        regenerate();
      };
      server.watcher.on("add", handler);
      server.watcher.on("unlink", handler);
      server.watcher.on("change", handler);
      // Pierwsze odświeżenie przy starcie dev servera.
      regenerate();
    },
  };
}

export default defineConfig({
  vite: {
    plugins: [autoManifestPlugin()],
  },
});
