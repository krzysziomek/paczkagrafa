import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Sparkles, Settings, ExternalLink } from "lucide-react";

const SITE_URL = "https://paczkagrafa.pl";
const PAGE_URL = `${SITE_URL}/jak-korzystac`;
const PAGE_TITLE = "Jak korzystać? — Paczka Grafa | Instrukcja instalacji";
const PAGE_DESC =
  "Krok po kroku: jak pobrać i zainstalować Paczkę Grafa w Minecraft. Instrukcja wgrania resourcepacka, włączenia paczki w grze i FAQ.";

type FaqItem = { q: string; a: string };

function getFaqItems(): FaqItem[] {
  return [
    {
      q: "Która paczka jest dla mojej wersji Minecraft?",
      a: "Wersja jest oznaczona w nazwie pliku (np. 1.21, 1.19, 1.16). Wybierz paczkę odpowiadającą wersji Twojej gry. Jeśli grasz na 1.21.x, weź najnowszą oznaczoną 1.21.",
    },
    {
      q: "Paczka się nie pojawia w Minecraft — co robić?",
      a: "Upewnij się, że plik .zip jest w folderze resourcepacks i NIE jest rozpakowany. Następnie zrestartuj Minecraft. Jeśli dalej nie widzi — sprawdź wersję paczki vs wersję gry.",
    },
    {
      q: "Co to jest „Overlay”?",
      a: "Overlay to dodatkowa warstwa nakładana na interfejs gry — np. ozdobne ramki ekwipunku, paska zdrowia, GUI. Można używać razem z innymi paczkami.",
    },
    {
      q: "Co to są „Ramki do rud”?",
      a: "Paczka, która podświetla rudy w jaskiniach kolorowymi ramkami. Bardzo ułatwia ich zauważanie podczas kopania.",
    },
    {
      q: "Czy paczka działa z modami / Optifine?",
      a: "Tak — to standardowy resource pack. Działa zarówno na vanilla, jak i z Optifine, Sodium, Iris i większością modów graficznych.",
    },
  ];
}

export const Route = createFileRoute("/jak-korzystac")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Jak korzystać? — Paczka Grafa" },
      { property: "og:description", content: PAGE_DESC },
      { property: "og:type", content: "article" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: `${SITE_URL}/graf.svg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Jak korzystać? — Paczka Grafa" },
      { name: "twitter:description", content: PAGE_DESC },
      { name: "twitter:image", content: `${SITE_URL}/graf.svg` },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "HowTo",
              "@id": `${PAGE_URL}#howto`,
              name: "Jak zainstalować Paczkę Grafa w Minecraft",
              description: PAGE_DESC,
              inLanguage: "pl-PL",
              totalTime: "PT2M",
              tool: [{ "@type": "HowToTool", name: "Minecraft (Java Edition)" }],
              step: [
                {
                  "@type": "HowToStep",
                  position: 1,
                  name: "Pobierz paczkę",
                  text: "Wybierz wersję paczki dopasowaną do Twojej wersji Minecraft i pobierz plik .zip ze strony głównej.",
                  url: `${SITE_URL}/`,
                },
                {
                  "@type": "HowToStep",
                  position: 2,
                  name: "Otwórz folder resourcepacks",
                  text: "W Minecraft wejdź w Opcje → Paczki zasobów → Otwórz folder paczek (lub ręcznie: %appdata%\\.minecraft\\resourcepacks).",
                },
                {
                  "@type": "HowToStep",
                  position: 3,
                  name: "Wrzuć plik .zip",
                  text: "Skopiuj pobrany plik .zip do folderu resourcepacks. NIE rozpakowuj go.",
                },
                {
                  "@type": "HowToStep",
                  position: 4,
                  name: "Aktywuj paczkę w grze",
                  text: "Wróć do gry, kliknij paczkę na liście dostępnych, przesuń ją do aktywnych i zatwierdź przyciskiem Gotowe.",
                },
              ],
            },
            {
              "@type": "FAQPage",
              "@id": `${PAGE_URL}#faq`,
              inLanguage: "pl-PL",
              mainEntity: faqJsonLd(),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Strona główna", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Jak korzystać?", item: PAGE_URL },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: JakKorzystacPage,
});

function faqJsonLd() {
  return getFaqItems().map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  }));
}

function JakKorzystacPage() {
  const faqItems = getFaqItems();

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-10 text-center">
        <h1 className="font-pixel font-bold text-2xl sm:text-3xl md:text-4xl text-primary mb-4">
          Paczka Grafa
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg font-semibold">
          Kompletny przewodnik po instalacji i użytkowaniu
        </p>
      </header>

      <section aria-labelledby="instrukcja" className="mb-14">
        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <HelpCircle className="h-6 w-6 text-primary" />
            <CardTitle id="instrukcja" className="text-xl font-bold">
              Jak korzystać z Paczki Grafa?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground/90 leading-relaxed font-medium">
            <p>
              Aby korzystać z paczki zasobów Grafa należy pobrać wybrane przez siebie paczki,
              następnie przenieść je do folderu{" "}
              <strong className="font-bold text-foreground">resourcepacks</strong>, do którego
              dostęp możemy uzyskać klikając przycisk{" "}
              <strong className="font-bold text-foreground">Otwórz folder z paczkami zasobów</strong>{" "}
              zlokalizowany na dole ekranu w zakładce Paczki Zasobów w ustawieniach Minecrafta.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-background/40 p-4">
                <div className="mb-2 flex items-center gap-2 font-bold text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Optifine:
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Do pełnego korzystania z paczki potrzebny nam będzie{" "}
                  <a
                    href="https://optifine.net/downloads"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                  >
                    Optifine <ExternalLink className="h-3 w-3" />
                  </a>
                  .
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-background/40 p-4">
                <div className="mb-2 flex items-center gap-2 font-bold text-foreground">
                  <Settings className="h-4 w-4 text-primary" />
                  Fabric:
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Możesz również używać paczki na silniku Fabric. Wymagany jest wtedy mod{" "}
                  <a
                    href="https://modrinth.com/mod/entity-texture-features-fabric"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                  >
                    Entity Texture Features <ExternalLink className="h-3 w-3" />
                  </a>
                  .
                </p>
              </div>
            </div>

            <p className="text-sm italic text-muted-foreground">
              Jeśli podczas instalacji Optifine wystąpi błąd, upewnij się że masz zainstalowaną{" "}
              <a
                href="https://www.java.com/pl/download/"
                target="_blank"
                rel="noreferrer noopener"
                className="font-bold text-primary hover:underline"
              >
                Javę
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="faq">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h2 id="faq" className="font-pixel font-bold text-lg sm:text-xl">
            Najczęstsze pytania
          </h2>
        </div>
        <Accordion type="single" collapsible className="rounded-lg border border-border/60 bg-card/40">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="px-4">
              <AccordionTrigger className="text-left text-base font-bold">{item.q}</AccordionTrigger>
              <AccordionContent className="text-foreground/85 leading-relaxed font-medium">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
}