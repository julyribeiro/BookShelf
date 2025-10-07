"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBooks() {
  return prisma.book.findMany({
    include: { genre: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBookById(id: string) {
  const bookId = parseInt(id);
  if (isNaN(bookId)) return null;

  return prisma.book.findUnique({
    where: { id: bookId },
    include: { genre: true },
  });
}

export async function createBook(data: any) {
  try {
    await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        year: data.year ? Number(data.year) : null,
        pages: data.pages ? Number(data.pages) : null,
        rating: data.rating ? Number(data.rating) : null,
        synopsis: data.synopsis || "",
        cover: data.cover || "",
        status: data.status || "QUERO_LER",
        genreId: data.genreId ? Number(data.genreId) : null,
      },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("❌ Erro ao criar livro:", error);
    throw error;
  }
}

export async function updateBook(id: number, data: any) {
  try {
    await prisma.book.update({
      where: { id },
      data: {
        title: data.title,
        author: data.author,
        year: data.year ? Number(data.year) : null,
        pages: data.pages ? Number(data.pages) : null,
        rating: data.rating ? Number(data.rating) : null,
        synopsis: data.synopsis || "",
        cover: data.cover || "",
        status: data.status || "QUERO_LER",
        genreId: data.genreId ? Number(data.genreId) : null,
      },
    });

    revalidatePath(`/book/${id}`);
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("❌ Erro ao atualizar livro:", error);
    throw error;
  }
}

export async function deleteBook(id: number) {
  try {
    await prisma.book.delete({ where: { id } });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("❌ Erro ao excluir livro:", error);
    throw error;
  }
}
