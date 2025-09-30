// src/components/ui/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const active = theme === "system" ? resolvedTheme : theme;

  return (
    <div className="relative inline-block text-left">
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md border border-border bg-card text-card-foreground transition"
      >
        {active === "dark" ? <Moon className="w-5 h-5" /> : active === "light" ? <Sun className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-card p-2 border border-border"
        >
          <li>
            <button
              role="menuitem"
              className="w-full text-left px-2 py-2 rounded hover:bg-muted"
              onClick={() => { setTheme("light"); setOpen(false); }}
            >
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" /> Light
              </div>
            </button>
          </li>
          <li>
            <button
              role="menuitem"
              className="w-full text-left px-2 py-2 rounded hover:bg-muted"
              onClick={() => { setTheme("dark"); setOpen(false); }}
            >
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4" /> Dark
              </div>
            </button>
          </li>
          <li>
            <button
              role="menuitem"
              className="w-full text-left px-2 py-2 rounded hover:bg-muted"
              onClick={() => { setTheme("system"); setOpen(false); }}
            >
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4" /> System
              </div>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
