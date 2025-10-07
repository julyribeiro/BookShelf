// src/app/book/[id]/page.tsx

import { notFound } from "next/navigation";
import { getBookById } from "@/lib/actions";
import BookDetailView from "@/components/BookDetailView"; 
// Importação de Metadata removida, conforme a correção anterior

// O tipo principal da página (essencial para o TS)
type BookPageProps = {
  params: { id: string };
};

export default async function BookDetailsPage({ 
  params, 
}: BookPageProps) {
  
  // Agora o TS sabe que params é { id: string }
  const { id } = params; 
  const book = await getBookById(id);

  if (!book) {
    return notFound();
  }

  return (
    <BookDetailView book={book} />
  );
}
