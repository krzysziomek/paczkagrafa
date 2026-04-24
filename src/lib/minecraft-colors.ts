// Parser kodów kolorów Minecrafta (§ + znak).
// Wspierane kody zgodne z grą; reszta jest ignorowana.

export type MinecraftSegment = {
  text: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
};

// Mapowanie kodów Minecrafta -> CSS color.
// Wartości jaśniejsze, by były czytelne na ciemnym i jasnym tle.
export const MC_COLORS: Record<string, string> = {
  "0": "#000000", // black
  "1": "#0000AA", // dark_blue
  "2": "#00AA00", // dark_green
  "3": "#00AAAA", // dark_aqua
  "4": "#AA0000", // dark_red
  "5": "#AA00AA", // dark_purple
  "6": "#FFAA00", // gold
  "7": "#AAAAAA", // gray
  "8": "#555555", // dark_gray
  "9": "#5555FF", // blue
  a: "#55FF55", // green
  b: "#55FFFF", // aqua
  c: "#FF5555", // red
  d: "#FF55FF", // light_purple (pink)
  e: "#FFFF55", // yellow
  f: "#FFFFFF", // white
};

const FORMAT_CODES = new Set(["k", "l", "m", "n", "o", "r"]);

export function parseMinecraftText(input: string): MinecraftSegment[] {
  const segments: MinecraftSegment[] = [];
  let current: MinecraftSegment = { text: "" };

  const push = () => {
    if (current.text.length === 0) return;
    segments.push({ ...current });
    current = { ...current, text: "" };
  };

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === "§" && i + 1 < input.length) {
      const code = input[i + 1].toLowerCase();
      if (MC_COLORS[code]) {
        push();
        // Kolor resetuje formatowanie (zachowanie MC).
        current = { text: "", color: MC_COLORS[code] };
        i++;
        continue;
      }
      if (FORMAT_CODES.has(code)) {
        push();
        if (code === "l") current.bold = true;
        else if (code === "o") current.italic = true;
        else if (code === "n") current.underline = true;
        else if (code === "m") current.strikethrough = true;
        else if (code === "r") current = { text: "" };
        i++;
        continue;
      }
    }
    current.text += ch;
  }
  push();

  // Jeśli tekst nie miał żadnych kodów — zwróć go jako 1 segment bez koloru.
  if (segments.length === 0) return [{ text: input }];
  return segments;
}

/** Czysty tekst bez kodów — przydatne do title/aria-label. */
export function stripMinecraftCodes(input: string): string {
  return input.replace(/§./g, "");
}

/** Usuwa rozszerzenie .zip oraz nadmiarowe spacje. */
export function prettyFilename(name: string): string {
  return name.replace(/\.zip$/i, "").replace(/\s+/g, " ").trim();
}