// src/app/edit-book/[id]/page.tsx

import { BookFormValues } from "@/lib/schemas";
import { getBookAction } from "@/app/actions";
import BookEditFormClient from "../../../components/BookEditFormClient";
import { getAllCategories } from "@/app/actions";
import { BookWithGenre } from "@/data/books";

type ReadingStatus = "LENDO" | "CONCLUIDO" | "PLANEJADO" | "ABANDONADO";
import { notFound } from "next/navigation";

interface EditBookPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;

  const book = await fetchBookData(id);
  const categories = await getAllCategories();

  if (!book) notFound();

  const initialBookData = {
    id: String(book.id),
    title: book.title,
    author: book.author,
    status: mapStatusToForm(book.status),
    year: book.year ?? null,
    currentPage: book.currentPage ?? null,
    isbn: book.isbn ?? null,
    synopsis: book.synopsis ?? null,
    genreId: book.genreId ?? null,
    rating: book.rating ?? null,
    pages: book.pages ?? null,
    cover: book.cover ?? null,
    notes: book.notes ?? null,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
    genre: book.genre,
  };

  return (
    <main className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-1">
          Editar Livro: {book.title}
        </h1>
        <BookEditFormClient
          initialBook={initialBookData as any}
          categories={categories}
        />
      </div>
    </main>
  );
}
async function fetchBookData(id: string): Promise<BookWithGenre | null> {
  try {
    const book = await getBookAction(id);
    return book ?? null;
  } catch (error) {
    return null;
  }
}
function mapStatusToForm(status: string): ReadingStatus {
  const validStatuses: ReadingStatus[] = [
    "LENDO",
    "CONCLUIDO",
    "PLANEJADO",
    "ABANDONADO",
  ];
  if (validStatuses.includes(status as ReadingStatus)) {
    return status as ReadingStatus;
  }
  return "PLANEJADO";
}
