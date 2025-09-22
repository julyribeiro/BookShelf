// src/app/library/page.tsx
"use client";

import { Suspense } from "react";
import { useState, useMemo, useEffect } from "react";
import { getBooks, updateBooks } from "@/data/books";
import { FaPlus, FaPencilAlt, FaTrashAlt, FaSearch } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Book } from '@/types/book';
import StarRating from '@/components/StarRating';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSearchParams } from "next/navigation";

const genres = [
  "Todos os Gêneros",
  "Literatura Brasileira",
  "Ficção Científica",
  "Realismo Mágico",
  "Ficção",
  "Fantasia",
  "Romance",
  "Biografia",
  "História",
  "Autoajuda",
  "Tecnologia",
  "Programação",
  "Negócios",
  "Psicologia",
  "Filosofia",
  "Poesia"
];

const statuses = [
  "Todos os Status",
  "LENDO",
  "LIDO",
  "QUERO_LER",
  "PAUSADO",
  "ABANDONADO"
];

// ======== EXPORT PADRÃO ENVOLTO EM SUSPENSE ========
export default function LibraryPage() {
  return (
    <Suspense fallback={<div>Carregando…</div>}>
      <LibraryPageInner />
    </Suspense>
  );
}

// ======== COMPONENTE PRINCIPAL (usa useSearchParams) ========
function LibraryPageInner() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'Todos os Status';

  const [books, setBooks] = useState<Book[]>(getBooks());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos os Gêneros');
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);

  const { toast } = useToast();

  const handleDelete = (bookId: string) => {
    const updatedBooks = books.filter(book => book.id !== bookId);
    setBooks(updatedBooks);
    updateBooks(updatedBooks);
    toast({
      title: "Livro excluído!",
      description: "O livro foi removido da sua biblioteca com sucesso.",
    });
  };

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === 'Todos os Gêneros' || book.genre === selectedGenre;
      const matchesStatus = selectedStatus === 'Todos os Status' || book.status === selectedStatus;
      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [books, searchQuery, selectedGenre, selectedStatus]);

  useEffect(() => {
    const newStatus = searchParams.get('status') || 'Todos os Status';
    setSelectedStatus(newStatus);
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Minha Biblioteca</h1>
        <Button asChild>
          <Link href="/add-book" className="flex items-center">
            <FaPlus className="mr-2" /> Adicionar Livro
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por título ou autor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Gênero" />
          </SelectTrigger>
          <SelectContent>
            {genres.map(genre => (
              <SelectItem key={genre} value={genre}>{genre}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>
                {status.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
        <span>{filteredBooks.length} de {books.length} livros</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.length === 0 ? (
          <p className="text-center col-span-full text-gray-500 text-lg">
            Nenhum livro encontrado com os filtros aplicados.
          </p>
        ) : (
          filteredBooks.map((book: Book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
              <div className="relative w-full h-96 group">
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <div className="flex gap-4">
                    <Button asChild className="p-2 h-10 w-10 rounded-full cursor-pointer hover:bg-blue-600">
                      <Link href={`/edit-book/${book.id}`} className="flex items-center justify-center">
                        <FaPencilAlt className="text-white" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="p-2 h-10 w-10 rounded-full cursor-pointer hover:bg-red-600">
                          <FaTrashAlt className="text-white" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso removerá permanentemente o livro &quot;{book.title}&quot;.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(book.id)}>
                            Continuar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                {book.cover ? (
                  <Image
                    src={book.cover}
                    alt={`Capa do livro ${book.title}`}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    Sem Capa
                  </div>
                )}
              </div>
              <Link href={`/book/${book.id}`} className="block">
                <div className="p-4 flex flex-col items-center text-center cursor-pointer">
                  <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                    {book.title}
                  </h2>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <div className="flex items-center justify-center my-2">
                    <StarRating rating={book.rating || 0} />
                  </div>
                  {book.status && (
                    <span className="mt-2 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {book.status.replace('_', ' ').toUpperCase()}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
