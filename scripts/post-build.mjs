#!/usr/bin/env node
// Post-build: generuje sitemap.xml + robots.txt w katalogu wyjściowym
// oraz kopiuje index.html → 404.html (SPA fallback dla GitHub Pages).
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// TanStack Start kładzie statyczne pliki w .output/public lub dist — sprawdzamy.
const candidates = [
  join(root, "dist", "client"),
  join(root, ".output", "public"),
  join(root, "dist"),
  join(root, "build"),
];
const outDir = candidates.find((p) => existsSync(p));
if (!outDir) {
  console.warn("[post-build] Nie znaleziono katalogu wyjściowego — pomijam.");
  process.exit(0);
}

// Adres bazowy (do sitemap)
const SITE_URL = (process.env.SITE_URL || "https://example.github.io").replace(/\/$/, "");
const BASE = (process.env.BASE_URL || "/").replace(/\/$/, "");

const routes = ["/", "/jak-korzystac", "/rzeczy-grafa"];
const today = new Date().toISOString().split("T")[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) =>
      `  <url><loc>${SITE_URL}${BASE}${r === "/" ? "" : r}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${r === "/" ? "1.0" : "0.8"}</priority></url>`
  )
  .join("\n")}
</urlset>
`;
writeFileSync(join(outDir, "sitemap.xml"), sitemap, "utf8");

const robots = `User-agent: *
Allow: /
Sitemap: ${SITE_URL}${BASE}/sitemap.xml
`;
writeFileSync(join(outDir, "robots.txt"), robots, "utf8");

// SPA fallback dla GitHub Pages
const indexPath = join(outDir, "index.html");
if (existsSync(indexPath)) {
  copyFileSync(indexPath, join(outDir, "404.html"));
}

// .nojekyll
writeFileSync(join(outDir, ".nojekyll"), "", "utf8");

console.log(`[post-build] sitemap.xml + robots.txt + 404.html + .nojekyll → ${outDir}`);