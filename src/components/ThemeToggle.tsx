"use client";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

// Função que garante que o valor é um ThemeMode
function isThemeMode(value: string): value is ThemeMode {
  return ["light", "dark", "system"].includes(value);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("system");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as ThemeMode | null;
    if (saved && isThemeMode(saved)) setTheme(saved);
  }, []);

  useEffect(() => {
    if (theme === "system") {
      localStorage.removeItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    } else {
      localStorage.setItem("theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (isThemeMode(value)) setTheme(value);
  };

  return (
    <select value={theme} onChange={handleChange}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}

