import { createFileRoute } from "@tanstack/react-router";
import { DownloadWizard } from "@/components/DownloadWizard";
import grafLogo from "@/assets/graf.svg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Paczka Grafa — Overlay, Ramki Rud i więcej do Minecraft" },
      { name: "description", content: "Pobierz Paczkę Grafa: overlay GUI, ramki podświetlające rudy i inne resourcepacki do Minecraft. Wszystkie wersje od 1.8 do 1.21." },
      { property: "og:title", content: "Paczka Grafa — Resource packi do Minecraft" },
      { property: "og:description", content: "Overlay, ramki rud i inne paczki do wszystkich wersji Minecraft." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="text-center mb-12">
        <img src={grafLogo} alt="" className="h-24 w-24 mx-auto mb-6" style={{ imageRendering: "pixelated" }} />
        <h1 className="font-pixel text-3xl sm:text-4xl md:text-5xl text-primary mb-4 leading-tight">
          Paczka Grafa
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
          Resourcepacki do Minecraft: <span className="text-foreground">overlay</span>,{" "}
          <span className="text-foreground">ramki do rud</span> i inne dodatki. Wybierz, pobierz, graj.
        </p>
      </header>
      <section aria-labelledby="pobieranie" className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-5 sm:p-8 shadow-xl">
        <h2 id="pobieranie" className="sr-only">Pobieranie</h2>
        <DownloadWizard />
      </section>
    </main>
  );
}
