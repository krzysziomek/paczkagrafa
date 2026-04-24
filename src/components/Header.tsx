import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import grafLogo from "@/assets/graf.svg";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Strona główna", exact: true },
  { to: "/jak-korzystac", label: "Jak korzystać?" },
  { to: "/rzeczy-grafa", label: "Rzeczy Grafa" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          onClick={() => setOpen(false)}
          aria-label="Paczka Grafa — strona główna"
        >
          <img
            src={grafLogo}
            alt=""
            className="h-9 w-9 transition-transform group-hover:scale-110"
            style={{ imageRendering: "pixelated" }}
          />
          <span className="font-pixel text-sm sm:text-base text-foreground tracking-wide">
            Paczka Grafa
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors",
                "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>

        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Otwórz menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border/60 bg-background animate-in fade-in slide-in-from-top-2">
          <div className="container mx-auto flex flex-col px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                activeProps={{ className: "bg-accent text-accent-foreground" }}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}