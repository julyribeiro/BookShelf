import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReadingStatus, Book, Genre } from "@prisma/client";
import FormToast from "@/components/FormToast";
import BookEditFormClient from './BookEditFormClient'; 

// --- CORREÇÃO DA TIPAGEM PARA EVITAR ERRO DE COMPATIBILIDADE ---
type BookWithGenre = Book & {
  genre: Genre | null;
};

// Interface ajustada para garantir campos obrigatórios como string,
// resolvendo o erro que você encontrou.
interface BookFormClientProps {
  initialBook: Omit<BookWithGenre, 'title' | 'author'> & { 
    title: string;
    author: string;
  };
  categories: Genre[];
}
// -------------------------------------------------------------------

// --- SERVER COMPONENT: Busca de Dados ---
export default async function EditBookPage({ params }: { params: { id: string } }) {
  const numericId = Number(params.id);

  if (isNaN(numericId)) {
    return notFound(); 
  }

  // Busca o livro e os gêneros em paralelo
  const [book, categories] = await Promise.all([
    prisma.book.findUnique({
      where: { id: numericId },
      include: {
        genre: true, 
      },
    }),
    prisma.genre.findMany({ 
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!book) {
    return notFound(); 
  }
  
  // Garante que o rating seja number ou null, conforme a tipagem do Prisma (BookWithGenre)
  const bookWithGenre: BookWithGenre = {
    ...book,
    // Se book.rating for null, atribua null. Se não, use o valor existente (number).
    rating: book.rating ?? null 
};

  return (
    <>
      <FormToast /> 
      <BookEditFormClient 
            // O cast é mantido pois a outra tipagem (title/author) está correta
            initialBook={bookWithGenre as BookFormClientProps['initialBook']} 
            categories={categories} 
        />
    </>
  );
}