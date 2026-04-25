/**
 * Wspólny helper SEO — generuje meta tagi, JSON-LD i linki canonical
 * dla TanStack Router `head()`. Wszystko spójnie: og:*, twitter:*, robots,
 * canonical i alternate (hreflang).
 */

export const SITE_URL = "https://txtgrafa.pl";
export const SITE_NAME = "Paczka Grafa";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/graf.svg`;
export const DEFAULT_LOCALE = "pl-PL";
export const DEFAULT_OG_LOCALE = "pl_PL";

export type SeoMetaInput = {
  /** Ścieżka strony bez domeny, np. "/jak-korzystac" lub "/" */
  path: string;
  title: string;
  description: string;
  /** Jeśli pusty — używamy DEFAULT_OG_IMAGE. Podaj URL absolutny. */
  image?: string;
  /** Domyślnie "website". Dla artykułów / instrukcji użyj "article". */
  ogType?: "website" | "article";
  /** Domyślnie "summary_large_image". */
  twitterCard?: "summary" | "summary_large_image";
  /** Domyślnie "index, follow, max-image-preview:large". */
  robots?: string;
  /** Lista alternatywnych wersji językowych. Klucz = hreflang. */
  alternates?: Array<{ hreflang: string; href: string }>;
};

function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean === "/" ? "" : clean}`;
}

/** Buduje sekcję `meta` dla TanStack `head()`. */
export function buildMeta(input: SeoMetaInput) {
  const url = absoluteUrl(input.path);
  const image = input.image ?? DEFAULT_OG_IMAGE;
  const ogType = input.ogType ?? "website";
  const twitterCard = input.twitterCard ?? "summary_large_image";
  const robots = input.robots ?? "index, follow, max-image-preview:large, max-snippet:-1";

  return [
    { title: input.title },
    { name: "description", content: input.description },
    { name: "robots", content: robots },
    { name: "author", content: "Graf" },

    // Open Graph
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:type", content: ogType },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:locale", content: DEFAULT_OG_LOCALE },
    { property: "og:site_name", content: SITE_NAME },

    // Twitter
    { name: "twitter:card", content: twitterCard },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: image },
  ];
}

/** Buduje sekcję `links` dla TanStack `head()` — canonical + alternates. */
export function buildLinks(input: SeoMetaInput) {
  const url = absoluteUrl(input.path);
  const links: Array<{ rel: string; href: string; hreflang?: string }> = [
    { rel: "canonical", href: url },
  ];
  if (input.alternates?.length) {
    for (const alt of input.alternates) {
      links.push({ rel: "alternate", hreflang: alt.hreflang, href: alt.href });
    }
    // x-default — wskazuje wersję domyślną dla nieobsługiwanych języków
    links.push({ rel: "alternate", hreflang: "x-default", href: url });
  }
  return links;
}

/** Buduje wpis `WebPage` JSON-LD ze spójnym brandingiem. */
export function buildWebPageJsonLd(input: SeoMetaInput & { breadcrumbs?: Array<{ name: string; path: string }> }) {
  const url = absoluteUrl(input.path);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: input.title,
      description: input.description,
      inLanguage: DEFAULT_LOCALE,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      primaryImageOfPage: input.image ? { "@type": "ImageObject", url: input.image } : undefined,
    },
  ];

  if (input.breadcrumbs?.length) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumbs`,
      itemListElement: input.breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: absoluteUrl(b.path),
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/** Skrót — zwraca obiekt `head()` z meta + links + jeden lub więcej JSON-LD. */
export function buildSeoHead(
  input: SeoMetaInput & {
    breadcrumbs?: Array<{ name: string; path: string }>;
    /** Dodatkowe bloki JSON-LD specyficzne dla podstrony (HowTo, ItemList, FAQPage…). */
    extraJsonLd?: unknown[];
  }
) {
  const jsonLd = buildWebPageJsonLd(input);
  const scripts = [
    {
      type: "application/ld+json" as const,
      children: JSON.stringify(jsonLd),
    },
    ...(input.extraJsonLd ?? []).map((blob) => ({
      type: "application/ld+json" as const,
      children: JSON.stringify(blob),
    })),
  ];
  return {
    meta: buildMeta(input),
    links: buildLinks(input),
    scripts,
  };
}
