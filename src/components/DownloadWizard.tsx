import { useMemo, useState } from "react";
import { Download as DownloadIcon, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CATEGORIES, type Category, type FileEntry } from "@/data/files";
import { findSpecialLink } from "@/data/special-links";
import { MinecraftText } from "./MinecraftText";
import { fireConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

const CATEGORY_META: Record<
  Category["id"],
  { emoji: string; description: string }
> = {
  overlay: {
    emoji: "🎨",
    description: "Paczki overlay GUI — ozdobne ramki ekwipunku, paska zdrowia, HUD.",
  },
  ramki: {
    emoji: "💎",
    description: "Ramki podświetlające rudy w jaskiniach — łatwiej kopać.",
  },
  pozostale: {
    emoji: "📦",
    description: "Inne paczki — Disco Ziemniaki, Niska Tarcza, Legacy Efficiency.",
  },
};

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function buildHref(file: FileEntry) {
  const special = findSpecialLink(file.name);
  if (special) return { href: special.url, external: true, special };
  if (isExternalUrl(file.path)) return { href: file.path, external: true, special: undefined };
  return {
    href: `${BASE}/${file.path.replace(/^\//, "")}`,
    external: false,
    special: undefined,
  };
}

export function DownloadWizard() {
  const [categoryId, setCategoryId] = useState<Category["id"] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const category = useMemo(
    () => CATEGORIES.find((c) => c.id === categoryId) ?? null,
    [categoryId]
  );
  const file = useMemo(
    () => category?.files.find((f) => f.name === fileName) ?? null,
    [category, fileName]
  );

  const action = file ? buildHref(file) : null;
  const isExternal = !!action?.external;

  const handleAction = () => {
    if (!action) return;
    fireConfetti();
  };

  return (
    <div className="space-y-8">
      {/* Krok 1 */}
      <section aria-labelledby="krok-1">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-pixel text-xs text-primary">KROK 1</span>
          <h2 id="krok-1" className="text-lg font-semibold">
            Wybierz kategorię
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CATEGORIES.map((c) => {
            const meta = CATEGORY_META[c.id];
            const active = c.id === categoryId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCategoryId(c.id);
                  setFileName(null);
                }}
                className={cn(
                  "relative text-left rounded-xl border-2 p-5 transition-all",
                  "bg-card/60 backdrop-blur",
                  active
                    ? "border-primary shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_25%,transparent)]"
                    : "border-border/60 hover:border-primary/50 hover:-translate-y-0.5"
                )}
                aria-pressed={active}
              >
                {active && (
                  <span className="absolute top-3 right-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                <div className="text-3xl mb-2" aria-hidden="true">
                  {meta.emoji}
                </div>
                <div className="font-pixel text-sm text-foreground mb-1">
                  {c.label}
                </div>
                <div className="text-xs text-muted-foreground leading-snug">
                  {meta.description}
                </div>
                <div className="mt-3 text-xs text-primary/80">
                  {c.files.length} {c.files.length === 1 ? "plik" : "plików"}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Krok 2 */}
      <section aria-labelledby="krok-2" className={cn(!category && "opacity-50 pointer-events-none")}>
        <div className="flex items-center gap-3 mb-4">
          <span className="font-pixel text-xs text-primary">KROK 2</span>
          <h2 id="krok-2" className="text-lg font-semibold">
            Wybierz plik
          </h2>
        </div>
        <Card className="border-border/60 bg-card/60 backdrop-blur p-2">
          {!category ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Najpierw wybierz kategorię powyżej.
            </div>
          ) : category.files.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Brak plików w tej kategorii.
            </div>
          ) : (
            <ScrollArea className="h-[280px] sm:h-[320px]">
              <ul role="listbox" aria-label="Lista plików" className="p-1 space-y-1">
                {category.files.map((f) => {
                  const selected = f.name === fileName;
                  return (
                    <li key={f.name}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => setFileName(f.name)}
                        className={cn(
                          "w-full text-left rounded-md px-3 py-2.5 transition-colors flex items-center gap-3",
                          selected
                            ? "bg-primary/15 ring-1 ring-primary/60"
                            : "hover:bg-accent"
                        )}
                      >
                        <span
                          className={cn(
                            "h-2 w-2 shrink-0 rounded-full",
                            selected ? "bg-primary" : "bg-muted-foreground/40"
                          )}
                          aria-hidden="true"
                        />
                        <MinecraftText
                          text={f.name}
                          pretty
                          className="text-sm flex-1 break-all"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          )}
        </Card>
      </section>

      {/* Akcja */}
      <section aria-labelledby="krok-3">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-pixel text-xs text-primary">KROK 3</span>
          <h2 id="krok-3" className="text-lg font-semibold">
            Pobierz lub przejdź
          </h2>
        </div>
        <div className="space-y-3">
          <Button
            asChild={!!action}
            disabled={!action}
            size="lg"
            className={cn(
              "w-full h-14 text-base font-semibold uppercase tracking-wide",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "shadow-[0_0_0_0_var(--primary)] hover:shadow-[0_0_30px_-5px_var(--primary)] transition-shadow"
            )}
          >
            {action ? (
              <a
                href={action.href}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : { download: "" })}
                onClick={handleAction}
                className="inline-flex items-center justify-center gap-2"
              >
                {isExternal ? (
                  <>
                    <ExternalLink className="h-5 w-5" />
                    Przejdź
                  </>
                ) : (
                  <>
                    <DownloadIcon className="h-5 w-5" />
                    Pobierz
                  </>
                )}
              </a>
            ) : (
              <span className="inline-flex items-center justify-center gap-2">
                <DownloadIcon className="h-5 w-5" />
                Wybierz plik
              </span>
            )}
          </Button>

          <p
            className={cn(
              "text-center text-xs sm:text-sm rounded-md px-3 py-2",
              !action && "text-muted-foreground",
              action && !isExternal && "text-muted-foreground",
              action &&
                isExternal &&
                "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
            )}
          >
            {!action && "Wybierz kategorię i plik, by aktywować przycisk."}
            {action && !isExternal && "↓ Pobieranie bezpośrednie na Twój dysk"}
            {action &&
              isExternal &&
              `⚠ Opuszczasz Paczkę Grafa — zasób hostowany${action.special?.provider ? ` na ${action.special.provider}` : " zewnętrznie"}.`}
          </p>
        </div>
      </section>
    </div>
  );
}