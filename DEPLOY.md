# Deployment — GitHub Pages

## Konfiguracja jednorazowa

1. **Push na GitHub** (połącz repo przez Lovable → Connectors → GitHub).
2. W repo: **Settings → Pages → Source: GitHub Actions**.
3. (Opcjonalnie) **Settings → Secrets and variables → Actions → Variables**:
   - `BASE_URL` = `/<nazwa-repo>/` jeśli wdrażasz na *project page*
     (np. `/paczka-grafa/`). Dla `<user>.github.io` zostaw puste.
   - `SITE_URL` = `https://twoj-user.github.io` (albo własna domena) — używane w sitemap.

## Workflow

Po każdym pushu na `main` workflow `.github/workflows/deploy.yml`:
1. Instaluje zależności (`bun install`).
2. Generuje manifest plików ze skanu `public/pliki/` (prebuild).
3. Buduje statyczną SPA do `.output/public/`.
4. Generuje `sitemap.xml`, `robots.txt`, `404.html`, `.nojekyll` (postbuild).
5. Publikuje na GitHub Pages.

## Dodawanie nowych plików .zip

Wrzuć plik do odpowiedniego folderu w `public/pliki/`:
- `public/pliki/overlay/` — paczki overlay
- `public/pliki/ramki/` — ramki do rud
- `public/pliki/pozostale/` — inne paczki
- `public/pliki/inne/` — załączniki dla "Rzeczy Grafa" (config Lunara, mody)

Commit + push → manifest regeneruje się automatycznie, plik pojawia się w UI.

## Specjalne linki (przekierowania zamiast pobierania)

Edytuj `src/data/special-links.ts`. Dopasowanie po fragmencie nazwy
(case-insensitive). Domyślnie skonfigurowany jest jeden wpis:
*Glowing Ores → Modrinth*.

## Lokalne testy

```bash
bun install
bun run dev          # http://localhost:8080
bun run build        # build statyczny
```
