'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              BookShelf
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Navegação principal">
            <Link href="/dashboard" aria-label="Ir para Dashboard">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium btn-focus transition-colors"
              >
                Início
              </Button>
            </Link>
            <Link href="/library" aria-label="Ir para Biblioteca">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium btn-focus transition-colors"
              >
                Biblioteca
              </Button>
            </Link>
            <Link href="/add-book" aria-label="Adicionar novo livro">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium  btn-focus transition-colors"
              >
                Adicionar Livro
              </Button>
            </Link>
          </nav>

          {/* Mobile Navigation*/}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-gray-700  btn-focus hover:text-blue-600 hover:bg-blue-50"
                aria-label="Abrir menu de navegação"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-gray-200 p-0 bg-white">
              <nav className="flex flex-col space-y-2 mt-6 p-4" role="navigation" aria-label="Navegação mobile">
                <Link href="/dashboard" className="w-full">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-700 btn-focus hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                  >
                    Início
                  </Button>
                </Link>
                <Link href="/library" className="w-full">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-700 btn-focus hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                  >
                    Biblioteca
                  </Button>
                </Link>
                <Link href="/add-book" className="w-full">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start btn-focus text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                  >
                    Adicionar Livro
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}