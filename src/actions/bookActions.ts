"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BookFormValues } from "@/lib/schemas"; // Mantido o tipo do Zod

// -------------------------------------------------------
// 🔧 FUNÇÕES AUXILIARES
// -------------------------------------------------------

// Garante Number ou undefined para genreId (resolve erro 2322)
function getGenreIdUpdateValue(value: any): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

// Garante Number ou null para campos Int opcionais do DB (year, pages, rating)
function getOptionalNumberValue(value: any): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const num = Number(value);
  return isNaN(num) ? null : num;
}

// Remove propriedades undefined (necessário pro Prisma ignorar campos vazios)
function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const newObj: Partial<T> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

// -------------------------------------------------------
// 📘 CRIAR LIVRO
// -------------------------------------------------------
export async function createBookAction(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());

    const createData = {
      title: String(data.title),
      author: String(data.author),
      year: getOptionalNumberValue(data.year),
      pages: getOptionalNumberValue(data.pages), // corrigido
      rating: getOptionalNumberValue(data.rating),
      synopsis: data.synopsis ? String(data.synopsis) : null,
      cover: data.cover ? String(data.cover) : null,
      status: (data.status as any) || "QUERO_LER",
      currentPage: data.currentPage ? Number(data.currentPage) : 0,
      isbn: data.isbn ? String(data.isbn) : null,
      notes: data.notes ? String(data.notes) : null,
      genreId: getGenreIdUpdateValue(data.genreId),
    };

    await prisma.book.create({
      data: removeUndefined(createData) as any,
    });

    revalidatePath("/library", "page");
    revalidatePath("/");

    redirect("/library");
  } catch (error: any) {
    if (error.message.includes("NEXT_REDIRECT")) throw error;
    console.error("❌ Erro ao criar livro:", error);
    return { success: false, error: "Falha ao salvar o livro no banco de dados." };
  }
}

// -------------------------------------------------------
// ✏️ ATUALIZAR LIVRO
// -------------------------------------------------------
export async function updateBookAction(formData: FormData) {
  try {
    const id = formData.get("id") as string;

    const updatedBook = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        title: formData.get("title")?.toString() || "",
        author: formData.get("author")?.toString() || "",
        year: Number(formData.get("year")) || null,
        pages: Number(formData.get("totalPages")) || null,
        currentPage: Number(formData.get("currentPage")) || 0,
        rating: Number(formData.get("rating")) || null,
        synopsis: formData.get("synopsis")?.toString() || null,
        cover: formData.get("cover")?.toString() || null,
        isbn: formData.get("isbn")?.toString() || null,
        notes: formData.get("notes")?.toString() || null,
        genreId: Number(formData.get("genreId")) || null,
        status: formData.get("status") as any,
      },
    });

    return { success: true, book: updatedBook }; // ✅ RETORNO PADRONIZADO
  } catch (error) {
    console.error("Erro ao atualizar livro:", error);
    return { error: "Erro ao atualizar livro." };
  }
}


// -------------------------------------------------------
// 🗑️ DELETAR LIVRO
// -------------------------------------------------------
interface DeleteActionResponse {
  success: boolean;
  error?: string;
}

export async function deleteBookAction(formDataOrId: FormData | string): Promise<DeleteActionResponse> {
  "use server";

  let bookIdString: string | null = null;

  if (typeof formDataOrId === "string") {
    bookIdString = formDataOrId;
  } else if (formDataOrId instanceof FormData) {
    bookIdString = formDataOrId.get("bookId") as string;
  }

  if (!bookIdString) return { success: false, error: "ID do livro não fornecido." };
  const bookId = Number(bookIdString);
  if (isNaN(bookId)) return { success: false, error: "ID inválido para exclusão." };

  try {
    await prisma.book.delete({ where: { id: bookId } });
    revalidatePath("/library", "page");
    return { success: true };
  } catch (error: any) {
    console.error("❌ Erro ao deletar livro:", error);
    return { success: false, error: "Erro ao deletar o livro. Verifique se o ID existe." };
  }
}

// -------------------------------------------------------
// 🔍 BUSCAR LIVRO POR ID
// -------------------------------------------------------
export type BookWithGenre = Awaited<ReturnType<typeof prisma.book.findUnique>>;

export async function getBookById(id: string): Promise<BookWithGenre> {
  const bookId = Number(id);
  if (isNaN(bookId)) return null;
  return prisma.book.findUnique({
    where: { id: bookId },
    // include: { genre: true }, // opcional
  });
}

// -------------------------------------------------------
// ⚡ CLIENT ACTION (caso precise usar fora de formulário)
// -------------------------------------------------------
export async function updateBookActionClient(data: BookFormValues): Promise<void> {
  try {
    const bookId = Number(data.id);
    if (isNaN(bookId)) throw new Error("ID inválido para atualização.");

    await prisma.book.update({
      where: { id: bookId },
      data: removeUndefined({
        title: data.title,
        author: data.author,
        status: data.status as any,
        year: data.year,
        pages: data.totalPages, // mantido conforme o Zod
        rating: data.rating,
        synopsis: data.synopsis,
        cover: data.coverUrl,
        currentPage: data.currentPage ?? 0,
        isbn: data.isbn,
        notes: data.personalNotes,
        genreId: getGenreIdUpdateValue(data.genreId),
      }),
    });

    revalidatePath("/library", "page");
    revalidatePath(`/book/edit/${data.id}`);
    redirect("/library");
  } catch (error: any) {
    if (error.message.includes("NEXT_REDIRECT")) throw error;
    console.error("❌ Erro ao atualizar livro via Cliente:", error);
    throw new Error("Falha ao salvar o livro no banco de dados. " + (error.message || "Erro desconhecido."));
  }
}
