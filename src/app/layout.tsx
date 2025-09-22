// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; 
import { Header } from '@/components/Header'; 
import { Footer } from '@/components/Footer';
import { Toaster } from "@/components/ui/toaster"; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BookShelf - Gerenciador de Biblioteca Pessoal',
  description: 'Uma aplicação para catalogar e organizar seus livros.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}