import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Download, FolderOpen, Play, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/jak-korzystac")({
  head: () => ({
    meta: [
      { title: "Jak korzystać? — Paczka Grafa | Instrukcja instalacji" },
      {
        name: "description",
        content:
          "Krok po kroku: jak pobrać i zainstalować Paczkę Grafa w Minecraft. Instrukcja wgrania resourcepacka, włączenia paczki w grze i FAQ.",
      },
      { property: "og:title", content: "Jak korzystać? — Paczka Grafa" },
      {
        property: "og:description",
        content: "Instrukcja instalacji Paczki Grafa w Minecraft krok po kroku.",
      },
      { property: "og:type", content: "article" },
    ],
  }),
  component: JakKorzystacPage,
});

const steps = [
  {
    icon: Download,
    title: "1. Pobierz paczkę",
    body: "Wejdź na stronę główną, wybierz kategorię (Overlay / Ramki Rud / Pozostałe), wybierz konkretny plik z listy i kliknij „Pobierz”. Plik .zip zostanie zapisany na Twoim dysku.",
  },
  {
    icon: FolderOpen,
    title: "2. Otwórz folder z paczkami zasobów",
    body: "Uruchom Minecraft → Opcje → Paczki zasobów → kliknij „Otwórz folder paczek”. Otworzy się katalog resourcepacks. Przeciągnij tam pobrany plik .zip — nie rozpakowuj go!",
  },
  {
    icon: Play,
    title: "3. Włącz paczkę w grze",
    body: "Wróć do okna Minecraft. Paczka pojawi się po lewej stronie. Najedź na nią i kliknij strzałkę, by przesunąć ją do aktywnych. Kliknij „Gotowe” — od teraz tekstury są aktywne.",
  },
];

const faq = [
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

function JakKorzystacPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-10 text-center">
        <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl text-primary mb-4">
          Jak korzystać?
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Instalacja Paczki Grafa w Minecraft — krok po kroku.
        </p>
      </header>

      <section aria-labelledby="kroki" className="mb-14">
        <h2 id="kroki" className="sr-only">
          Kroki instalacji
        </h2>
        <div className="grid gap-4 sm:gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <Card
                key={s.title}
                className="border-border/60 bg-card/60 backdrop-blur transition-colors hover:border-primary/40"
              >
                <CardHeader className="flex-row items-center gap-4 space-y-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{s.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-relaxed">
                  {s.body}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="faq">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h2 id="faq" className="font-pixel text-lg sm:text-xl">
            Najczęstsze pytania
          </h2>
        </div>
        <Accordion type="single" collapsible className="rounded-lg border border-border/60 bg-card/40">
          {faq.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="px-4">
              <AccordionTrigger className="text-left text-base">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
}