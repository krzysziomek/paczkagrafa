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

// === Mapowanie z manifestu ===
// Manifest jest automatycznie regenerowany:
//  - przed `dev` i `build` (skrypt `prebuild`/`predev`),
//  - na żywo w trybie dev przez plugin Vite, który nasłuchuje
//    public/pliki/** i nadpisuje JSON gdy wrzucisz/usuniesz plik.
// Dzięki temu nie trzeba ręcznie aktualizować listy.
const categories: Category[] = raw.categories.map((c) => ({
  id: c.id as Category["id"],
  label: c.label,
  folder: c.folder,
  files: [...c.files],
}));

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
