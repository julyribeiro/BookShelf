"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ReadingStatus } from "@prisma/client";


type BookForm = {
  title: string;
  author: string;
  genreId: number;
  year: number;
  pages: number;
  rating: number;
  synopsis: string;
  cover: string;
  status?: string;
  currentPage?: number;
  isbn?: string;
  notes?: string;
};

export async function createBookAction(data: BookForm) {
  await prisma.book.create({
    data: {
      ...data,
      status: (data.status as ReadingStatus) ?? ReadingStatus.QUERO_LER,

    },
  });
  revalidatePath("/");
}

export async function updateBookAction(id: number, data: Partial<BookForm>) {
  await prisma.book.update({
    where: { id },
    data: {
      ...data,
      status: (data.status as ReadingStatus) ?? ReadingStatus.QUERO_LER,

    },
  });
  revalidatePath("/");
}

export async function deleteBookAction(id: number) {
  await prisma.book.delete({
    where: { id },
  });
  revalidatePath("/");
}
