// src/actions/bookActions.ts (Apenas a função createBookAction foi alterada)

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ReadingStatus } from "@prisma/client";
// import { redirect } from "next/navigation"; // Não usaremos redirect mais no createBookAction

// Função auxiliar para converter string para número ou null
function safeParseInt(value: FormDataEntryValue | null): number | null {
    if (value === null || typeof value !== 'string' || value.trim() === '') {
        return null;
    }
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
}

// Função auxiliar para converter string para float (para rating)
function safeParseFloat(value: FormDataEntryValue | null): number | null {
    if (value === null || typeof value !== 'string' || value.trim() === '') {
        return null;
    }
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
}

// =========================================================================================
// CRIAÇÃO (CORRIGIDA)
// =========================================================================================

export async function createBookAction(formData: FormData) {
    
    // 1. Extração e conversão
    const genreId = safeParseInt(formData.get("genreId"));
    const year = safeParseInt(formData.get("year"));
    const pages = safeParseInt(formData.get("pages"));
    const currentPage = safeParseInt(formData.get("currentPage"));
    const rating = safeParseFloat(formData.get("rating"));

    const data = {
        title: formData.get("title") as string,
        author: formData.get("author") as string,
        synopsis: formData.get("synopsis") as string,
        cover: formData.get("cover") as string,
        notes: formData.get("notes") as string,
        status: formData.get("status") as string,
    };

    // 2. Validação básica
    // Título, Autor e Gênero são obrigatórios (baseado no schema).
    if (!data.title || !data.author || genreId === null) {
        console.error("Dados obrigatórios ausentes: Título, Autor ou Gênero.");
        // Retorna objeto de erro
        return { success: false, message: "Título, Autor e Gênero são obrigatórios." }; 
    }

    try {
        // Tenta criar o livro no banco de dados
        const newBook = await prisma.book.create({
            data: {
                title: data.title,
                author: data.author,
                // Campos opcionais (String?) no schema
                synopsis: data.synopsis || null,
                cover: data.cover || null,
                notes: data.notes || null,
                
                // Campos numéricos
                genreId: genreId as number,
                year: year,
                pages: pages,
                rating: rating ?? 0,
                currentPage: currentPage ?? 0,

                // Enum
                status: (data.status as ReadingStatus) ?? ReadingStatus.QUERO_LER,
            },
        });

        // 3. SUCESSO: Retorna objeto de sucesso
        revalidatePath("/library");
        return { success: true, id: newBook.id, message: "Livro criado com sucesso!" };

    } catch (error) {
        // 4. ERRO: Loga o erro real e retorna objeto de erro
        console.error("Erro REAL de DB ao criar livro:", error);
        return { success: false, message: "Falha interna ao salvar o livro." };
    }
}


// O RESTO DO SEU CÓDIGO (updateBookAction e deleteBookAction) PERMANECE O MESMO.
// =========================================================================================
// ATUALIZAÇÃO
// =========================================================================================

export async function updateBookAction(formData: FormData) {
    
    // ... código inalterado ...
}

// =========================================================================================
// EXCLUSÃO
// =========================================================================================

export async function deleteBookAction(id: string) {
    const numericId = safeParseInt(id); // Reutilizando a função auxiliar

    if (numericId === null) {
        return { success: false, message: "ID inválido para exclusão." };
    }

    try {
        await prisma.book.delete({
            where: { id: numericId },
        });
        
        revalidatePath("/library");
        return { success: true, message: "Livro excluído com sucesso!" };

    } catch (error) {
        console.error("Erro ao deletar livro:", error);
        return { success: false, message: "Falha ao excluir o livro." };
    }
}