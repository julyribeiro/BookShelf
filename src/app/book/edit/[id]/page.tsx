// src/app/book/edit/[id]/page.tsx

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getBookById } from "@/lib/actions";
import BookEditFormClient from "@/components/BookEditFormClient";

type BookEditPageProps = {
  params: { id: string };
};

export default async function BookEditPage({ params }: BookEditPageProps) {
  const { id } = params;

  // getBookById recebe o ID como string (resolvendo erro anterior)
  const book = await getBookById(id);

  // A busca de categorias usa a importação nomeada 'prisma'
  const categories = await prisma.genre.findMany();

  if (!book) {
    return notFound();
  }

  return (
    // Passa as props com os nomes corretos
    <BookEditFormClient initialBook={book} categories={categories} />
  );
}
