import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReadingStatus, Book, Genre } from "@prisma/client";
import FormToast from "@/components/FormToast";
import BookEditFormClient from './BookEditFormClient'; 

// --- TIPAGEM AUXILIAR ---
type BookWithGenre = Book & {
  genre: Genre | null;
};

interface BookFormClientProps {
  initialBook: Omit<BookWithGenre, 'title' | 'author'> & { 
    title: string;
    author: string;
  };
  categories: Genre[];
}
// -------------------------------------------------------------------

// --- SERVER COMPONENT: Busca de Dados (CORRIGIDO PARA O BUILD DO VERCEL) ---
// Usamos 'any' na assinatura para contornar o erro de tipagem persistente 'PageProps'
export default async function EditBookPage(props: any) {
  // Cast interno para tipar 'params' corretamente
  const { params } = props as { params: { id: string } }; 
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
  
  const bookWithGenre: BookWithGenre = {
    ...book,
    rating: book.rating ?? null 
  };

  return (
    <>
      <FormToast /> 
      <BookEditFormClient 
            initialBook={bookWithGenre as BookFormClientProps['initialBook']} 
            categories={categories} 
        />
    </>
  );
}