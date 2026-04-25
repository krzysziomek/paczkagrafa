import { createFileRoute, Link } from "@tanstack/react-router";
import { buildSeoHead, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/$")({
  head: () =>
    buildSeoHead({
      path: "/404",
      title: "404 — Nie znaleziono strony | Paczka Grafa",
      description:
        "Strona, której szukasz, nie istnieje lub została przeniesiona. Wróć na stronę główną Paczki Grafa.",
      robots: "noindex, follow",
      breadcrumbs: [
        { name: "Strona główna", path: "/" },
        { name: "404", path: "/404" },
      ],
      extraJsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${SITE_URL}/404#errorpage`,
          name: "404 — Strona nie znaleziona",
          inLanguage: "pl-PL",
          isPartOf: { "@id": `${SITE_URL}/#website` },
          mainEntity: {
            "@type": "Thing",
            name: "HTTP 404 Not Found",
          },
        },
      ],
    }),
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <main className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <p className="font-pixel text-6xl text-primary">404</p>
        <h1 className="mt-6 font-pixel text-2xl sm:text-3xl text-foreground">
          Nie znaleziono strony
        </h1>
        <p className="mt-4 text-muted-foreground font-medium">
          Ten URL nie pasuje do żadnej podstrony Paczki Grafa. Sprawdź adres albo wróć na stronę
          główną.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Strona główna
          </Link>
          <Link
            to="/jak-korzystac"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-accent"
          >
            Jak korzystać?
          </Link>
          <Link
            to="/rzeczy-grafa"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-accent"
          >
            Rzeczy Grafa
          </Link>
        </div>
      </div>
    </main>
  );
}