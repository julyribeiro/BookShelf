"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBookAction(formData: FormData) {
  try {
    // Converte o FormData em um objeto simples
    const data = Object.fromEntries(formData.entries());

    // Converte os campos numéricos corretamente
    const newBook = await prisma.book.create({
      data: {
        title: String(data.title),
        author: String(data.author),
        year: data.year ? Number(data.year) : null,
        pages: data.pages ? Number(data.pages) : null,
        rating: data.rating ? Number(data.rating) : null,
        synopsis: data.synopsis ? String(data.synopsis) : null,
        cover: data.cover ? String(data.cover) : null,
        status: (data.status as any) || "QUERO_LER",
        currentPage: data.currentPage ? Number(data.currentPage) : 0,
        isbn: data.isbn ? String(data.isbn) : null,
        notes: data.notes ? String(data.notes) : null,
        genreId: Number(data.genreId),
      },
    });

    revalidatePath("/");
    return { success: true, newBook };
  } catch (error: any) {
    console.error("❌ Erro REAL de DB ao criar livro:", error);
    return { success: false, error: error.message };
  }
}
