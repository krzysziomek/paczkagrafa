import { parseMinecraftText, stripMinecraftCodes } from "@/lib/minecraft-colors";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  /** Jeśli true, usuwa rozszerzenie .zip i nadmiarowe spacje przed renderem. */
  pretty?: boolean;
};

/**
 * Renderuje tekst sformatowany kodami Minecrafta (§a, §b, §f, §d, §6, ...).
 * Każdy segment dostaje swój kolor inline (świadoma decyzja: kolory MC są stałe
 * i nie mapują się na semantyczne tokeny motywu — to celowo "ozdobne" akcenty).
 */
export function MinecraftText({ text, className, pretty = false }: Props) {
  const source = pretty
    ? text.replace(/\.zip$/i, "").replace(/\s+/g, " ").trim()
    : text;
  const segments = parseMinecraftText(source);
  return (
    <span className={cn("font-mono", className)} title={stripMinecraftCodes(source)}>
      {segments.map((seg, i) => (
        <span
          key={i}
          style={{
            color: seg.color,
            fontWeight: seg.bold ? 700 : undefined,
            fontStyle: seg.italic ? "italic" : undefined,
            textDecoration: [
              seg.underline ? "underline" : null,
              seg.strikethrough ? "line-through" : null,
            ]
              .filter(Boolean)
              .join(" ") || undefined,
          }}
        >
          {seg.text}
        </span>
      ))}
    </span>
  );
}