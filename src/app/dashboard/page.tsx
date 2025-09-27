// src/app/dashboard/page.tsx
"use client";

import { useMemo } from "react";
import { getBooks } from "../../../data/books";
import { FaBook, FaPlus, FaCheck, FaHourglassHalf, FaChartBar } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import StarRating from "@/components/StarRating";

export default function DashboardPage() {
  const allBooks = getBooks();

  // Calcular estatísticas
  const totalBooks = allBooks.length;
  const readingBooks = allBooks.filter(book => book.status === 'LENDO').length;
  const finishedBooks = allBooks.filter(book => book.status === 'LIDO').length;
  const totalPagesRead = allBooks
    .filter(book => book.status === 'LIDO' && book.pages)
    .reduce((sum, book) => sum + (book.pages || 0), 0);

  // Calcular Avaliação Média usando useMemo para otimizar
  const averageRating = useMemo(() => {
    const ratedBooks = allBooks.filter(book => book.rating);
    if (ratedBooks.length === 0) return 0;
    const totalRating = ratedBooks.reduce((sum, book) => sum + (book.rating || 0), 0);
    return totalRating / ratedBooks.length;
  }, [allBooks]);

  // Obter 5 livros mais recentes (os últimos adicionados)
  const recentBooks = allBooks.slice(-5);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Sua Biblioteca Pessoal</h1>
        <p className="text-lg text-gray-600">Acompanhe seu progresso de leitura, organize seus livros e descubra novas histórias</p>
      </div>
      
      {/* Botões de Ação */}
      <div className="flex justify-center gap-4 mb-8">
        <Button asChild size="lg">
          <Link href="/add-book" className="flex items-center">
            Adicionar Novo Livro
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/library" className="flex items-center">
            Ver Biblioteca
          </Link>
        </Button>
      </div>

      {/* Cards de Estatísticas - AGORA CLICÁVEIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card Total de Livros */}
        <Link href="/library" className="block">
          <Card className="flex items-center justify-between p-6 hover:shadow-lg transition-shadow duration-300">
            <div>
              <CardTitle className="text-sm font-medium text-gray-500">Total de Livros</CardTitle>
              <div className="text-3xl font-bold mt-1">{totalBooks}</div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaBook className="h-6 w-6 text-blue-600" />
            </div>
          </Card>
        </Link>
        {/* Card Lendo Atualmente */}
        <Link href="/library?status=LENDO" className="block">
          <Card className="flex items-center justify-between p-6 hover:shadow-lg transition-shadow duration-300">
            <div>
              <CardTitle className="text-sm font-medium text-gray-500">Lendo Atualmente</CardTitle>
              <div className="text-3xl font-bold mt-1">{readingBooks}</div>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FaHourglassHalf className="h-6 w-6 text-orange-600" />
            </div>
          </Card>
        </Link>
        {/* Card Livros Finalizados */}
        <Link href="/library?status=LIDO" className="block">
          <Card className="flex items-center justify-between p-6 hover:shadow-lg transition-shadow duration-300">
            <div>
              <CardTitle className="text-sm font-medium text-gray-500">Livros Finalizados</CardTitle>
              <div className="text-3xl font-bold mt-1">{finishedBooks}</div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaCheck className="h-6 w-6 text-green-600" />
            </div>
          </Card>
        </Link>
        {/* Card Páginas Lidas (não clicável neste caso) */}
        <Card className="flex items-center justify-between p-6">
          <div>
            <CardTitle className="text-sm font-medium text-gray-500">Páginas Lidas</CardTitle>
            <div className="text-2xl font-bold mt-1">{totalPagesRead}</div>
          </div>
          <div className="bg-purple-100 p-3 rounded-full">
            <FaChartBar className="h-6 w-6 text-purple-600" />
          </div>
        </Card>
      </div>

      <Separator className="my-8" />
      
      {/* Avaliação Média */}
      <Card className="p-6 mb-8">
        <CardTitle className="text-xl font-bold text-gray-900 mb-2">Avaliação Média</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
          <StarRating rating={averageRating} />
          <span className="text-sm text-gray-500">
            ({allBooks.filter(book => book.rating).length} avaliações)
          </span>
        </div>
      </Card>
      
      {/* Livros Recentes */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Livros Recentes</h2>
          <Button asChild variant="link" className="px-0">
            <Link href="/library">Ver Todos</Link>
          </Button>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {recentBooks.map((book) => (
            <div key={book.id} className="flex-shrink-0 w-[150px] md:w-[200px] hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
              <Link href={`/book/${book.id}`}>
                <div className="relative w-full h-[225px] md:h-[300px] mb-2">
                  {book.cover ? (
                    <Image
                      src={book.cover}
                      alt={`Capa do livro ${book.title}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 rounded-md">
                      Sem Capa
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-semibold truncate">{book.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{book.author}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}