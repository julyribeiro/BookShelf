// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import ThemeScript from "@/components/ThemeScript"; // novo componente

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookShelf - Gerenciador de Biblioteca Pessoal",
  description: "Uma aplicação para catalogar e organizar seus livros.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // CORREÇÃO: Adicionando suppressHydrationWarning={true} ao <html>
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        {/* Script para setar o tema ANTES da hidratação */}
        <ThemeScript />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          storageKey="bookshelf-theme"
          enableSystem
        >
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}