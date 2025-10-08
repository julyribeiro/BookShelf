// src/app/book/[id]/page.tsx

import { notFound } from "next/navigation";
import { getBookById } from "@/lib/actions";
import BookDetailView from "@/components/BookDetailView"; 
// Importação de Metadata removida, conforme a correção anterior

// O tipo principal da página (essencial para o TS)
type BookPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BookDetailsPage({ params }: BookPageProps) {
  const { id } = await params; // 👈 await obrigatório no Next 15+
  const book = await getBookById(id);

  if (!book) {
    return notFound();
  }

  return (
    <BookDetailView book={book} />
  );
}
