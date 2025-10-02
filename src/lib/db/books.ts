import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getBooks() {
  return prisma.book.findMany({
    include: { genre: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBook(id: number) {
  return prisma.book.findUnique({
    where: { id },
    include: { genre: true },
  });
}

export async function createBook(data: Prisma.BookCreateInput) {
  return prisma.book.create({ data });
}

export async function updateBook(id: number, data: Prisma.BookUpdateInput) {
  return prisma.book.update({
    where: { id },
    data,
  });
}

export async function deleteBook(id: number) {
  return prisma.book.delete({ where: { id } });
}
