// src/app/actions.ts

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BookFormValues } from "@/lib/schemas"; // Importamos o tipo Zod

// --- FUNÇÕES AUXILIARES DE CORREÇÃO ---

// 1. Garante Number ou undefined para IDs de relações (genreId)
// Retorna undefined se o valor for nulo, vazio ou inválido.
function getGenreIdUpdateValue(value: any): number | undefined {
    if (value === undefined || value === null || value === "") {
        return undefined; 
    }
    const num = Number(value);
    // Se não for um número válido, retorna undefined (para o campo ser ignorado no update)
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
 * Garante que o tipo de retorno é um objeto limpo para operações Prisma.
 */
function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
    const newObj: Partial<T> = {};
    for (const key in obj) {
        if (obj[key] !== undefined) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

// --- NOVAS FUNÇÕES EXPORTADAS (CORREÇÃO) ---

/**
 * [CORREÇÃO] Exporta a função de busca de categorias (REQUERIDA pelo page.tsx)
 */
export async function getAllCategories() {
    // Busca todas as categorias no banco de dados
    const categories = await prisma.genre.findMany({
        orderBy: { name: 'asc' }, // Ordenar é uma boa prática
    });
    return categories;
}

/**
 * [CORREÇÃO] Exporta a função de busca de livro (requerida pelo page.tsx)
 * @param id O ID do livro (string)
 */
export async function getBookAction(id: string) {
    // Buscamos o livro, incluindo o Genre se existir
    const book = await prisma.book.findUnique({
        where: { id: Number(id) },
        include: { genre: true },
    });
    // Retorna o livro (ou null se não encontrado).
    return book;
}


// --- FUNÇÕES DE CRUD EXISTENTES ---

// Função para criar um novo livro (CORRIGIDO: Mapeamento de totalPages, coverUrl, personalNotes)
export async function createBookAction(formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());

        const createData = {
            title: String(data.title),
            author: String(data.author),
            year: getOptionalNumberValue(data.year),
            
            // 🚨 CORREÇÃO: totalPages (Form/Zod) -> pages (Prisma)
            pages: getOptionalNumberValue(data.totalPages), 
            
            rating: getOptionalNumberValue(data.rating),
            synopsis: data.synopsis ? String(data.synopsis) : null,
            
            // 🚨 CORREÇÃO: coverUrl (Form/Zod) -> cover (Prisma)
            cover: data.coverUrl ? String(data.coverUrl) : null, 
            
            status: (data.status as any) || "WANT_TO_READ", 
            currentPage: getOptionalNumberValue(data.currentPage) ?? 0,
            isbn: data.isbn ? String(data.isbn) : null,
            
            // 🚨 CORREÇÃO: personalNotes (Form/Zod) -> notes (Prisma)
            notes: data.personalNotes ? String(data.personalNotes) : null, 
            
            genreId: getGenreIdUpdateValue(data.genreId), 
        };
        
        const finalData = removeUndefined(createData);

        // O erro `Unknown argument totalPages` é resolvido aqui, pois 'pages' está sendo usado.
        const newBook = await prisma.book.create({
            data: finalData as any,
        });

        revalidatePath("/library", "page");
        revalidatePath("/");

        redirect(`/book/${newBook.id}`); 
    } catch (error: any) {
        if (error.message.includes("NEXT_REDIRECT")) {
            throw error;
        }

        console.error("❌ Erro ao criar livro:", error);
        return { success: false, error: "Falha ao salvar o livro no banco de dados." };
    }
}

// Função para atualizar um livro (CORRIGIDO: Mapeamento de totalPages, coverUrl, personalNotes)
export async function updateBookActionClient(data: BookFormValues) {
    try {
        const bookId = Number(data.id);

        if (isNaN(bookId)) {
            throw new Error("ID do livro inválido para a atualização.");
        }
        
        // Mapeamento para o formato do banco de dados (Prisma)
        const updateData = {
            title: data.title,
            author: data.author,
            year: data.year,
            
            // 🚨 CORREÇÃO: totalPages (Form/Zod) -> pages (Prisma)
            pages: data.totalPages,
            
            currentPage: data.currentPage,
            rating: data.rating,
            status: data.status,
            isbn: data.isbn,
            
            // 🚨 CORREÇÃO: coverUrl (Form/Zod) -> cover (Prisma)
            cover: data.coverUrl,
            
            genreId: data.genreId,
            
            // 🚨 CORREÇÃO: personalNotes (Form/Zod) -> notes (Prisma)
            notes: data.personalNotes,
            
            synopsis: data.synopsis,
        };

        const finalData = removeUndefined(updateData); 

        // O erro 'Unknown argument pages' na função original é resolvido pelo mapeamento 'pages'.
        await prisma.book.update({
            where: { id: bookId },
            data: finalData as any,
        });

        revalidatePath("/library", "page");
        revalidatePath(`/edit-book/${data.id}`);
        revalidatePath(`/book/${data.id}`);

        return { success: true }; 
    } catch (error: any) {
        console.error("❌ Erro ao atualizar livro:", error);
        throw new Error("Falha ao atualizar o livro: " + (error.message || "Erro desconhecido"));
    }
}


// Função para deletar um livro pelo ID (Mantida)
export async function deleteBookAction(bookIdString: string) {
    const bookId = Number(bookIdString);

    if (isNaN(bookId)) {
        return { success: false, error: "ID do livro inválido para exclusão." };
    }

    try {
        await prisma.book.delete({
            where: { id: bookId },
        });

        revalidatePath("/library", "page");
        revalidatePath("/");

        // Retorna sucesso para o useFormState no DeleteBookButton
        return { success: true }; 
    } catch (error: any) {
        console.error("❌ Erro ao deletar livro:", error);
        return { success: false, error: "Erro ao deletar o livro. Verifique se o ID existe." };
    }
}