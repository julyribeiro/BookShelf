// src/app/book/edit/[id]/page.tsx

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getBookById } from "@/lib/actions";
import BookEditFormClient from "@/components/BookEditFormClient";

type BookEditPageProps = {
  params: { id: string }; // ✅ não é Promise
};

export default async function BookEditPage({ params }: BookEditPageProps) {
  const { id } = params; // ✅ sem await

  const book = await getBookById(id);
  const categories = await prisma.genre.findMany();

  if (!book) {
    return notFound();
  }

  return (
    <BookEditFormClient initialBook={book} categories={categories} />
  );
}
