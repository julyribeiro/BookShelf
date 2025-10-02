"use client";

export default function ThemeScript() {
  const setInitialTheme = `(function() {
    try {
      const key = 'bookshelf-theme';
      const persisted = localStorage.getItem(key);
      if (persisted) {
        if (persisted === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: setInitialTheme }}
    />
  );
}
