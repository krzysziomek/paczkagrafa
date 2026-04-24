// Klient theme. Domyślnie "dark". Trzymamy w localStorage pod kluczem "theme".

export type Theme = "light" | "dark";
const STORAGE_KEY = "theme";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export function setTheme(theme: Theme) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }
  applyTheme(theme);
}

/** Skrypt inline wstrzykiwany przed hydratacją — usuwa "flash of light theme". */
export const themeBootScript = `(function(){try{var k='theme';var t=localStorage.getItem(k);if(t!=='light'){t='dark';}var r=document.documentElement;r.classList.remove('light','dark');r.classList.add(t);r.style.colorScheme=t;}catch(e){var r=document.documentElement;r.classList.add('dark');r.style.colorScheme='dark';}})();`;