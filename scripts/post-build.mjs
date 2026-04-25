#!/usr/bin/env node
// Post-build: generuje SEO-friendly index.html (SPA shell), sitemap.xml,
// robots.txt, 404.html (SPA fallback) i .nojekyll dla GitHub Pages.
import {
  readFileSync,
  writeFileSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from "node:fs";
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

// Adres bazowy
const SITE_URL = (process.env.SITE_URL || "https://txtgrafa.pl").replace(/\/$/, "");
const BASE = (process.env.BASE_URL || "/").replace(/\/$/, "");
const BASE_SLASH = BASE === "" ? "/" : `${BASE}/`;

const routes = ["/", "/jak-korzystac", "/rzeczy-grafa"];
const today = new Date().toISOString().split("T")[0];

// Sitemap z xhtml:link (hreflang) — wszystkie podstrony + alternatywne wersje językowe.
// Aktualnie strona jest tylko po polsku, więc hreflang="pl" === x-default.
const LANGS = [
  { code: "pl", isDefault: true },
];

function urlFor(route) {
  return `${SITE_URL}${BASE}${route === "/" ? "" : route}`;
}

function urlEntry(route) {
  const loc = urlFor(route);
  const alternates = LANGS.map(
    (l) => `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${loc}" />`
  )
    .concat([`    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />`])
    .join("\n");
  const priority = route === "/" ? "1.0" : "0.8";
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
${alternates}
  </url>`;
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes.map(urlEntry).join("\n")}
</urlset>
`;
writeFileSync(join(outDir, "sitemap.xml"), sitemap, "utf8");

// robots.txt — generujemy TYLKO jeśli użytkownik nie umieścił własnego
// w public/. Dzięki temu można nadpisać domyślne zasady własnym plikiem.
const robotsPath = join(outDir, "robots.txt");
if (!existsSync(robotsPath)) {
  const robots = `User-agent: *
Allow: /
Sitemap: ${SITE_URL}${BASE}/sitemap.xml
`;
  writeFileSync(robotsPath, robots, "utf8");
}

// === Generuj SEO-rich index.html (SPA shell) ===
const assetsDir = join(outDir, "assets");
let cssFiles = [];
let entryJs = null;
if (existsSync(assetsDir)) {
  const files = readdirSync(assetsDir);
  cssFiles = files.filter((f) => f.endsWith(".css"));
  // Wyznacz prawdziwy client entry: Vite zawsze umieszcza w nim helper
  // `__vite__mapDeps` (tablica dynamicznych zależności). Pozostałe chunki
  // są tylko importowane przez entry — same go nie zawierają.
  const jsFiles = files.filter((f) => f.endsWith(".js"));
  const entryCandidates = jsFiles.filter((f) =>
    readFileSync(join(assetsDir, f), "utf8").includes("__vite__mapDeps")
  );
  // Wybierz największy kandydat (najpełniejszy entry — bootstrapuje aplikację).
  entryJs =
    entryCandidates
      .map((f) => ({ f, size: statSync(join(assetsDir, f)).size }))
      .sort((a, b) => b.size - a.size)[0]?.f ||
    // Awaryjnie: największy plik JS w katalogu.
    jsFiles
      .map((f) => ({ f, size: statSync(join(assetsDir, f)).size }))
      .sort((a, b) => b.size - a.size)[0]?.f ||
    null;
}

const SITE_NAME = "Paczka Grafa";
const SITE_DESC =
  "Pobierz Paczkę Grafa: overlay GUI, ramki podświetlające rudy i inne resourcepacki do Minecraft. Wszystkie wersje od 1.8 do 1.21.";
const SITE_TITLE = "Paczka Grafa — Overlay, Ramki Rud i więcej do Minecraft";
const OG_IMAGE = `${SITE_URL}${BASE}/graf.svg`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      description: SITE_DESC,
      inLanguage: "pl-PL",
      url: `${SITE_URL}/`,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Graf",
      url: `${SITE_URL}/`,
      logo: OG_IMAGE,
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`,
      name: SITE_TITLE,
      description: SITE_DESC,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      inLanguage: "pl-PL",
    },
  ],
};

// Wczytaj theme boot script (dark default + persist)
const themeBoot = `(()=>{try{var t=localStorage.getItem('theme');var d=t?t==='dark':true;var r=document.documentElement;if(d){r.classList.add('dark');r.style.colorScheme='dark';}else{r.classList.remove('dark');r.style.colorScheme='light';}}catch(e){document.documentElement.classList.add('dark');}})();`;

// Deploy verifier — sprawdza w konsoli, czy index.html i właściwy chunk JS się
// załadowały. Jeśli po 4s root nadal jest pusty (lub entry nie dał się załadować),
// rzuca widoczny komunikat błędu w konsoli i renderuje fallback w DOM.
const expectedEntry = entryJs ? `${BASE_SLASH}assets/${entryJs}` : "";
const deployVerifier = `(()=>{try{
  var EXPECTED=${JSON.stringify(expectedEntry)};
  var TAG='[paczka-grafa:deploy-check]';
  var loaded=false, errored=false;
  function findScript(){
    var s=document.querySelectorAll('script[type="module"]');
    for(var i=0;i<s.length;i++){ if(s[i].src && s[i].src.indexOf(EXPECTED)>=0) return s[i]; }
    return null;
  }
  var entry=findScript();
  if(!entry){ console.error(TAG,'BRAK tagu <script> dla entry chunk:',EXPECTED); }
  else {
    entry.addEventListener('load', function(){ loaded=true; console.info(TAG,'entry chunk OK:',EXPECTED); });
    entry.addEventListener('error', function(e){ errored=true; console.error(TAG,'NIE udało się załadować entry chunk:',EXPECTED, e); });
  }
  setTimeout(function(){
    var root=document.getElementById('root');
    var hasApp=root && root.children && root.children.length>0 && !(root.children.length===1 && root.children[0].tagName==='NOSCRIPT');
    if(!hasApp || errored){
      console.error(TAG,'STRONA SIĘ NIE WYRENDEROWAŁA. entryLoaded=',loaded,'entryError=',errored,'expected=',EXPECTED);
      if(root && !hasApp){
        root.innerHTML='<div style="padding:32px;font-family:system-ui,sans-serif;max-width:560px;margin:40px auto;border:1px solid #c00;border-radius:8px;color:#c00;background:#fff5f5"><h1 style="margin:0 0 12px">Strona się nie załadowała</h1><p>Skrypt aplikacji ('+EXPECTED+') nie wystartował. Sprawdź konsolę (F12), zakładka Network — pewnie 404 na chunkach JS. Najczęściej oznacza to złe ustawienie BASE_URL w deployu (GitHub Pages).</p><p><a href="${BASE_SLASH}pliki/" style="color:#c00">Pobierz pliki bezpośrednio</a></p></div>';
      }
    } else { console.info(TAG,'OK — aplikacja wyrenderowała #root'); }
  }, 4000);
}catch(e){ console.error('[paczka-grafa:deploy-check] verifier crashed', e); }})();`;

const cssLinks = cssFiles
  .map((f) => `    <link rel="stylesheet" crossorigin href="${BASE_SLASH}assets/${f}">`)
  .join("\n");
const entryScript = entryJs
  ? `    <script type="module" crossorigin src="${BASE_SLASH}assets/${entryJs}"></script>`
  : "";

const indexHtml = `<!doctype html>
<html lang="pl" suppressHydrationWarning>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0d0d0d" />
    <meta name="color-scheme" content="dark light" />

    <title>${SITE_TITLE}</title>
    <meta name="description" content="${SITE_DESC}" />
    <meta name="keywords" content="paczka grafa, minecraft, resourcepack, overlay, ramki rud, glowing ores, optifine, fabric, 1.21, 1.20, 1.19, 1.18, 1.17, 1.16, 1.8" />
    <meta name="author" content="Graf" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${SITE_URL}/" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="pl_PL" />
    <meta property="og:title" content="${SITE_TITLE}" />
    <meta property="og:description" content="${SITE_DESC}" />
    <meta property="og:url" content="${SITE_URL}/" />
    <meta property="og:image" content="${OG_IMAGE}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${SITE_TITLE}" />
    <meta name="twitter:description" content="${SITE_DESC}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />

    <link rel="icon" type="image/svg+xml" href="${BASE_SLASH}graf.svg" />
    <link rel="apple-touch-icon" href="${BASE_SLASH}graf.svg" />
    <link rel="manifest" href="${BASE_SLASH}site.webmanifest" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <script>${themeBoot}</script>
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>

${cssLinks}
${entryScript}
  </head>
  <body class="min-h-screen bg-background text-foreground antialiased">
    <div id="root">
      <noscript>
        <h1>Paczka Grafa</h1>
        <p>Ta strona wymaga włączonej obsługi JavaScript do wyświetlenia listy paczek do pobrania.</p>
        <p>Pliki znajdziesz bezpośrednio w katalogu <a href="${BASE_SLASH}pliki/">/pliki/</a>.</p>
      </noscript>
    </div>
    <script>${deployVerifier}</script>
  </body>
</html>
`;
writeFileSync(join(outDir, "index.html"), indexHtml, "utf8");

// Web App Manifest (PWA / instalowalność)
const webmanifest = {
  name: SITE_NAME,
  short_name: SITE_NAME,
  description: SITE_DESC,
  start_url: `${BASE_SLASH}`,
  scope: `${BASE_SLASH}`,
  display: "standalone",
  background_color: "#0d0d0d",
  theme_color: "#0d0d0d",
  lang: "pl-PL",
  icons: [
    { src: `${BASE_SLASH}graf.svg`, sizes: "any", type: "image/svg+xml", purpose: "any maskable" },
  ],
};
writeFileSync(join(outDir, "site.webmanifest"), JSON.stringify(webmanifest), "utf8");

// SPA fallback dla GitHub Pages
const indexPath = join(outDir, "index.html");
if (existsSync(indexPath)) {
  copyFileSync(indexPath, join(outDir, "404.html"));
}

// .nojekyll
writeFileSync(join(outDir, ".nojekyll"), "", "utf8");

console.log(
  `[post-build] index.html (SEO) + sitemap.xml + robots.txt + 404.html + site.webmanifest + .nojekyll → ${outDir}`
);
console.log(`[post-build] entry: ${entryJs || "(brak)"} | css: ${cssFiles.join(", ") || "(brak)"}`);