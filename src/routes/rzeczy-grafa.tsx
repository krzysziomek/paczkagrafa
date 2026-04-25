import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";
import { rzeczyGrafa } from "@/data/rzeczy-grafa";

const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
const SITE_URL = "https://paczkagrafa.pl";
const PAGE_URL = `${SITE_URL}/rzeczy-grafa`;
const PAGE_TITLE = "Rzeczy Grafa — tapety, configi, sprzęt | Paczka Grafa";
const PAGE_DESC =
  "Dodatkowe rzeczy Grafa: tapety, config Lunar Client, peleryna Optifine, lista sprzętu i paczki modów do serii Minecraft.";

export const Route = createFileRoute("/rzeczy-grafa")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Rzeczy Grafa — Paczka Grafa" },
      { property: "og:description", content: PAGE_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: `${SITE_URL}/graf.svg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Rzeczy Grafa — Paczka Grafa" },
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
              "@type": "CollectionPage",
              "@id": `${PAGE_URL}#page`,
              url: PAGE_URL,
              name: PAGE_TITLE,
              description: PAGE_DESC,
              inLanguage: "pl-PL",
              isPartOf: { "@id": `${SITE_URL}/#website` },
            },
            {
              "@type": "ItemList",
              "@id": `${PAGE_URL}#itemlist`,
              name: "Rzeczy Grafa",
              numberOfItems: rzeczyGrafa.length,
              itemListElement: rzeczyGrafa.map((item, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                name: item.title,
                description: item.content,
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Strona główna", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Rzeczy Grafa", item: PAGE_URL },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: RzeczyGrafaPage,
});

function resolveUrl(url: string, external: boolean) {
  if (external) return url;
  return `${BASE}/${url.replace(/^\//, "")}`;
}

function RzeczyGrafaPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <header className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl text-primary mb-4">Rzeczy Grafa</h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Kolekcja dodatków: tapety, configi, sprzęt i paczki modów.
        </p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {rzeczyGrafa.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="flex flex-col border-border/60 bg-card/60 backdrop-blur transition-all hover:border-primary/40 hover:-translate-y-0.5">
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 gap-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {item.links.map((link) => (
                    <Button key={link.url} asChild variant={link.external ? "outline" : "default"} size="sm">
                      <a
                        href={resolveUrl(link.url, link.external)}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        download={!link.external ? "" : undefined}
                      >
                        {link.external ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                        {link.text}
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
