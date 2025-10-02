'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose, // <-- IMPORTADO: Essencial para fechar o menu ao clicar
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { FaBook, FaHome, FaPlusCircle, FaBookOpen } from 'react-icons/fa';
import ThemeToggle from '@/components/ui/ThemeToggle';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
            >
              <FaBook className="text-2xl" /> BookShelf
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center space-x-6"
            role="navigation"
            aria-label="Navegação principal"
          >
            <Link href="/dashboard" aria-label="Ir para Dashboard">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium btn-focus transition-colors dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-gray-800"
              >
                <span className="flex items-center gap-1">
                  <FaHome /> Início
                </span>
              </Button>
            </Link>
            <Link href="/library" aria-label="Ir para Biblioteca">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium btn-focus transition-colors dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-gray-800"
              >
                <span className="flex items-center gap-1">
                  <FaBookOpen /> Biblioteca
                </span>
              </Button>
            </Link>
            <Link href="/add-book" aria-label="Adicionar novo livro">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium btn-focus transition-colors dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-gray-800"
              >
                <span className="flex items-center gap-1">
                  <FaPlusCircle /> Adicionar Livro
                </span>
              </Button>
            </Link>

            <ThemeToggle />
          </nav>

          {/* Mobile Actions: Theme Toggle + Menu */}
          <div className="flex items-center gap-2 md:hidden"> 
            
            <ThemeToggle />

            {/* Mobile Navigation (Sheet) */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700 btn-focus hover:text-blue-600 hover:bg-blue-50 dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-gray-800"
                  aria-label="Abrir menu de navegação"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 border-gray-200 p-0 bg-white dark:bg-gray-900 dark:border-gray-700"
              >
                <SheetHeader className="p-4 border-b dark:border-gray-700">
                    <SheetTitle className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        BookShelf
                    </SheetTitle>
                </SheetHeader>

                <nav
                  className="flex flex-col space-y-2 mt-4 p-4"
                  role="navigation"
                  aria-label="Navegação mobile"
                >
                  {/* Links de navegação ENVOLVIDOS POR SheetClose */}
                  <SheetClose asChild> 
                    <Link href="/dashboard" className="w-full">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-700 btn-focus hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-gray-800"
                      >
                        <span className="flex items-center gap-2">
                          <FaHome /> Início
                        </span>
                      </Button>
                    </Link>
                  </SheetClose>
                  
                  <SheetClose asChild>
                    <Link href="/library" className="w-full">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-700 btn-focus hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-gray-800"
                      >
                        <span className="flex items-center gap-2">
                          <FaBookOpen /> Biblioteca
                        </span>
                      </Button>
                    </Link>
                  </SheetClose>
                  
                  <SheetClose asChild>
                    <Link href="/add-book" className="w-full">
                      <Button
                        variant="ghost"
                        className="w-full justify-start btn-focus text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-gray-800"
                      >
                        <span className="flex items-center gap-2">
                          <FaPlusCircle /> Adicionar Livro
                        </span>
                      </Button>
                    </Link>
                  </SheetClose>

                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}