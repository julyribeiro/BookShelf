"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light'|'dark'|'system'>('system');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light'|'dark'|'system'|null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    if (theme === 'system') {
      localStorage.removeItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    } else {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  return (
    <select
  value={theme}
  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
    setTheme(e.target.value as "light" | "dark" | "system")
  }
>

      <option value="light">Light</option>

      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}