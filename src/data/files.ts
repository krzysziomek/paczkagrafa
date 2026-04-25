import manifestData from "./files-manifest.json";
import { SPECIAL_LINKS } from "./special-links";

export type FileEntry = {
  name: string;
  path: string;
  size: number;
  virtual?: boolean;
};

export type Category = {
  id: "overlay" | "ramki" | "pozostale";
  label: string;
  folder: string;
  files: FileEntry[];
};

type RawCategory = { id: string; label: string; folder: string; files: FileEntry[] };
const raw = manifestData as { categories: RawCategory[] };

// === Auto-wykrywanie plików ===
// Vite skanuje public/pliki/**/*.zip w czasie buildu/dev (HMR-friendly).
// Działa bez ręcznej aktualizacji manifestu — wystarczy wrzucić plik
// do public/pliki/<kategoria>/ i pojawi się w UI po reloadzie.
// Manifest JSON jest fallbackiem (gdy glob nic nie zwróci, np. podczas SSR
// pre-renderu na produkcji niektórych adapterów).
const globbed = import.meta.glob("/public/pliki/**/*.zip", {
  query: "?url",
  import: "default",
  eager: true,
}) as Record<string, string>;

const CATEGORY_DEFS = [
  { id: "overlay" as const, label: "Overlay", folder: "overlay" },
  { id: "ramki" as const, label: "Ramki Rud", folder: "ramki" },
  { id: "pozostale" as const, label: "Pozostałe", folder: "pozostale" },
];

function buildFromGlob(): Category[] {
  const byFolder = new Map<string, FileEntry[]>();
  for (const absPath of Object.keys(globbed)) {
    // /public/pliki/<folder>/<nazwa>.zip
    const match = absPath.match(/\/public\/pliki\/([^/]+)\/([^/]+\.zip)$/i);
    if (!match) continue;
    const [, folder, name] = match;
    const list = byFolder.get(folder) ?? [];
    list.push({
      name: decodeURIComponent(name),
      path: `pliki/${folder}/${name}`,
      size: 0, // rozmiar nieznany w runtime — manifest go uzupełnia gdy dostępny
    });
    byFolder.set(folder, list);
  }
  return CATEGORY_DEFS.map((def) => {
    const files = byFolder.get(def.folder) ?? [];
    // Najnowsze (heurystycznie po nazwie — odwrotnie alfabetycznie, jak w manifeście).
    files.sort((a, b) => b.name.localeCompare(a.name));
    return { ...def, files };
  });
}

function buildFromManifest(): Category[] {
  return raw.categories.map((c) => ({
    id: c.id as Category["id"],
    label: c.label,
    folder: c.folder,
    files: [...c.files],
  }));
}

// Wybierz źródło danych:
// - jeśli glob coś zwrócił, użyj go (auto-wykrywanie, najświeższe info),
// - inaczej spadnij do manifestu z post-build (dla statycznych deployów).
const fromGlob = buildFromGlob();
const hasGlobFiles = fromGlob.some((c) => c.files.length > 0);
const baseCategories = hasGlobFiles ? fromGlob : buildFromManifest();

// Wzbogacanie rozmiarami z manifestu (gdy oba źródła dostępne).
if (hasGlobFiles) {
  const sizeIndex = new Map<string, number>();
  for (const c of raw.categories) {
    for (const f of c.files) sizeIndex.set(f.path, f.size);
  }
  for (const c of baseCategories) {
    for (const f of c.files) {
      const s = sizeIndex.get(f.path);
      if (s) f.size = s;
    }
  }
}

const categories: Category[] = baseCategories;

for (const sp of SPECIAL_LINKS) {
  if (!sp.category || !sp.displayName) continue;
  const cat = categories.find((c) => c.id === sp.category);
  if (!cat) continue;
  if (cat.files.some((f) => f.name === sp.displayName)) continue;
  cat.files.unshift({
    name: sp.displayName,
    path: sp.url,
    size: 0,
    virtual: true,
  });
}

export const CATEGORIES: Category[] = categories;
