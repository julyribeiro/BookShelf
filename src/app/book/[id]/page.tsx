// src/app/book/[id]/page.tsx

import { notFound } from "next/navigation";
import { getBookById } from "@/lib/actions";
import BookDetailView from "@/components/BookDetailView"; 

type BookDetailsPageProps = {
  params: { id: string };
};

export default async function BookDetailsPage({ params }: BookDetailsPageProps) {
  // ✅ await params já não é mais necessário nas versões mais novas do Next.js
  const { id } = params;
  const book = await getBookById(id);

  if (!book) {
    return notFound();
  }

  // ✅ Aqui passamos o livro para o componente de visualização
  return (
    <BookDetailView book={book} />
  );
}

// ✅ Mantenha o generateMetadata
export async function generateMetadata({ params }: BookDetailsPageProps) {
  const { id } = params;
  const book = await getBookById(id);

  if (!book) {
    return { title: "Livro não encontrado" };
  }

  return { title: `${book.title} – Detalhes` };
}