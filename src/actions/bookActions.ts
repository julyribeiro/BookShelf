// src/actions/bookActions.ts

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BookFormValues } from "@/lib/schemas"; // Assumindo que você usa o tipo Zod aqui

// --- FUNÇÕES AUXILIARES DE CORREÇÃO ---

// 1. Garante Number ou undefined para IDs de relações (genreId)
// UNDEFINED resolve o erro 2322, fazendo o Prisma IGNORAR o campo.
function getGenreIdUpdateValue(value: any): number | undefined {
  // Se o valor for null, undefined, ou string vazia, retorna undefined.
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const num = Number(value);
  // Retorna undefined se for NaN
  return isNaN(num) ? undefined : num;
}

// 2. Garante Number ou null para campos Int opcionais do DB (year, pages, rating)
// Retorna null se o valor for nulo, vazio ou inválido.
function getOptionalNumberValue(value: any): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const num = Number(value);
  return isNaN(num) ? null : num;
}

/**
 * Remove todas as propriedades com valor 'undefined' de um objeto.
 * Essencial para o Prisma ignorar campos opcionais não fornecidos (como genreId).
 */
function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const newObj: Partial<T> = {};
  for (const key in obj) {
    // Verifica se a chave existe e o valor NÃO é undefined
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

// Função para criar um novo livro
export async function createBookAction(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());

    const createData = {
      title: String(data.title),
      author: String(data.author),
      year: getOptionalNumberValue(data.year),
      // 🚨 CORREÇÃO: Mapear 'totalPages' do formulário para 'pages' do Prisma.
      pages: getOptionalNumberValue(data.totalPages), 
      rating: getOptionalNumberValue(data.rating),
      synopsis: data.synopsis ? String(data.synopsis) : null,
      // 🚨 CORREÇÃO: Mapear 'cover' do formulário para 'cover' do Prisma (mantido, mas verifique o schema).
      cover: data.cover ? String(data.cover) : null,
      status: (data.status as any) || "QUERO_LER",
      currentPage: data.currentPage ? Number(data.currentPage) : 0,
      isbn: data.isbn ? String(data.isbn) : null,
      // 🚨 CORREÇÃO: Mapear 'notes' do formulário para 'notes' do Prisma.
      notes: data.notes ? String(data.notes) : null,

      // CORREÇÃO: Usamos 'undefined' (se vazio) para que removeUndefined possa atuar.
      genreId: getGenreIdUpdateValue(data.genreId),
    };

    // Filtra os campos 'undefined' e usa a conversão 'as any'
    await prisma.book.create({
      // Agora 'createData' contém o nome de campo 'pages' (Prisma) em vez de 'totalPages' (Form)
      data: removeUndefined(createData) as any,
    });

    revalidatePath("/library", "page");
    revalidatePath("/");

    redirect("/library");
  } catch (error: any) {
    if (error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("❌ Erro ao criar livro:", error);
    return {
      success: false,
      error: "Falha ao salvar o livro no banco de dados.",
    };
  }
}

// Função para atualizar um livro existente
export async function updateBookAction(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());

    const bookIdString = data.id as string;
    const bookId = Number(bookIdString);

    if (!bookIdString || isNaN(bookId)) {
      return {
        success: false,
        error: "ID do livro inválido para a atualização.",
      };
    }

    await prisma.book.update({
      where: { id: bookId },
      // Usa a função auxiliar
      data: removeUndefined({
        title: String(data.title),
        author: String(data.author),
        year: getOptionalNumberValue(data.year),
        // 🚨 CORREÇÃO: Mapear 'totalPages' do formulário para 'pages' do Prisma.
        pages: getOptionalNumberValue(data.totalPages), 
        rating: getOptionalNumberValue(data.rating),
        synopsis: data.synopsis ? String(data.synopsis) : null,
        // 🚨 CORREÇÃO: Mapear 'cover' do formulário para 'cover' do Prisma (mantido, mas verifique o schema).
        cover: data.cover ? String(data.cover) : null,
        status: (data.status as any) || "QUERO_LER",
        currentPage: data.currentPage ? Number(data.currentPage) : 0,
        isbn: data.isbn ? String(data.isbn) : null,
        // 🚨 CORREÇÃO: Mapear 'notes' do formulário para 'notes' do Prisma.
        notes: data.notes ? String(data.notes) : null,

        // Retorna 'number' ou 'undefined' (resolve o erro 2322)
        genreId: getGenreIdUpdateValue(data.genreId),
      }),
    });

    revalidatePath("/library", "page");
    revalidatePath(`/edit-book/${bookIdString}`);
    revalidatePath("/");

    redirect("/library");
  } catch (error: any) {
    if (error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("❌ Erro ao atualizar livro:", error);
    return {
      success: false,
      error: "Falha ao atualizar o livro no banco de dados.",
    };
  }
}

// Função para deletar um livro pelo ID
// Define a interface para o retorno da Action
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
        // Se estiver usando um formulário HTML, ele esperaria um campo chamado "bookId"
        bookIdString = formDataOrId.get("bookId") as string;
    }

    if (!bookIdString) {
        return { success: false, error: "ID do livro não fornecido." };
    }

    const bookId = Number(bookIdString);

    if (isNaN(bookId)) {
        return { success: false, error: "ID do livro inválido para exclusão." };
    }

    try {
        await prisma.book.delete({
            where: { id: bookId },
        });

        revalidatePath("/library", "page");

        // 🚨 CRUCIAL: REMOVER O redirect() DAQUI. 
        // A função cliente (handleDelete) fará o redirect após este retorno.
        
        return { success: true }; 
        
    } catch (error: any) {
        // O erro NEXT_REDIRECT não deve ocorrer mais.
        
        // Se for um erro real do Prisma (ex: registro não encontrado), capture e retorne.
        console.error("❌ Erro ao deletar livro:", error);
        
        return {
            success: false,
            error: "Erro ao deletar o livro. Verifique se o ID existe ou se há outras dependências.",
        };
    }
}

// ----------------------------------------------------------------------------------
// NOVO CÓDIGO: Função para buscar o livro pelo ID (RESOLVE O ERRO 2305)
// ----------------------------------------------------------------------------------

// Tipagem de retorno para garantir que o resultado seja compatível com o formulário
export type BookWithGenre = Awaited<ReturnType<typeof prisma.book.findUnique>>;

export async function getBookById(id: string): Promise<BookWithGenre> {
  const bookId = Number(id);
  if (isNaN(bookId)) {
    return null;
  }
  
  return prisma.book.findUnique({
    where: { id: bookId },
    // Inclua a relação Genre, se você a estiver usando no seu `page.tsx`
    // include: { genre: true }, 
  });
}


// ----------------------------------------------------------------------------------
// Ação Cliente 
// ----------------------------------------------------------------------------------
export async function updateBookActionClient(
  data: BookFormValues
): Promise<void> {
  try {
    const bookId = Number(data.id);

    if (isNaN(bookId)) {
      throw new Error("ID do livro inválido para a atualização.");
    }

    // Usa removeUndefined para garantir que genreId seja ignorado se nulo
    await prisma.book.update({
      where: { id: bookId },
      data: removeUndefined({
        title: data.title,
        author: data.author,
        status: data.status as any,

        year: data.year,
        // 🚨 CORREÇÃO: Mapear 'totalPages' do Zod para 'pages' do Prisma.
        pages: data.totalPages, 
        rating: data.rating,
        synopsis: data.synopsis,
        // 🚨 CORREÇÃO: Mapear 'coverUrl' do Zod para 'cover' do Prisma (mantido, mas verifique o schema).
        cover: data.coverUrl,
        currentPage: data.currentPage ?? 0,
        isbn: data.isbn,
        // 🚨 CORREÇÃO: Mapear 'personalNotes' do Zod para 'notes' do Prisma.
        notes: data.personalNotes,

        // Mapeamento: null do Zod -> undefined para o Prisma
        genreId: getGenreIdUpdateValue(data.genreId),
      }),
    });

    revalidatePath("/library", "page");
    revalidatePath(`/edit-book/${data.id}`);
    redirect("/library");
  } catch (error: any) {
    if (error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("❌ Erro ao atualizar livro via Cliente:", error);
    throw new Error(
      "Falha ao salvar o livro no banco de dados. " +
        (error.message || "Erro desconhecido.")
    );
  }
}