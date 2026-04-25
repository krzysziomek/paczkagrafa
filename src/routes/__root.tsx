import { Outlet, Link, createRootRoute, HeadContent, Scripts, ScriptOnce } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { themeBootScript } from "@/lib/theme";

const SITE_NAME = "Paczka Grafa";
const SITE_DESC = "Resourcepacki do Minecraft: overlay, ramki rud i inne dodatki Grafa.";

function NotFoundComponent() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-pixel text-5xl text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Nie znaleziono strony</h2>
        <p className="mt-2 text-sm text-muted-foreground">Ta strona nie istnieje lub została przeniesiona.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    </main>
  );
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://txtgrafa.pl/#website",
      name: SITE_NAME,
      description: SITE_DESC,
      inLanguage: "pl-PL",
      url: "https://txtgrafa.pl/",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://txtgrafa.pl/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://txtgrafa.pl/#org",
      name: "Graf",
      url: "https://txtgrafa.pl/",
    },
  ],
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0d0d0d" },
      { title: SITE_NAME },
      { name: "description", content: SITE_DESC },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "pl_PL" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: `${import.meta.env.BASE_URL || "/"}graf.svg` },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <ScriptOnce>{themeBootScript}</ScriptOnce>
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
