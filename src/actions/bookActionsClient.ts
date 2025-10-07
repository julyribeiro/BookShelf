// src/actions/bookActionsClient.ts

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BookFormValues } from "@/lib/schemas"; // Assumindo que você usa o tipo Zod aqui

// ----------------------------------------------------------------------------------
// FUNÇÃO AUXILIAR para tratar IDs numéricos opcionais (genreId)
// Retorna Number se for válido, e UNDEFINED se for nulo/vazio/inválido.
// UNDEFINED faz o Prisma ignorar o campo na atualização, resolvendo o erro 2322.
function getGenreIdUpdateValue(value: any): number | undefined {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }
    const num = Number(value);
    // Retorna undefined se for NaN (ex: string não numérica)
    return isNaN(num) ? undefined : num;
}
// ----------------------------------------------------------------------------------


// Assumindo que esta função era a que estava dando erro (talvez renomeada de updateBookActionClient)
// O nome da função abaixo pode precisar ser ajustado para o que você usa no seu componente cliente.
export async function updateBookFromClient(bookIdString: string, data: BookFormValues): Promise<void> {
    
    const { id: _, currentPage, totalPages, coverUrl, personalNotes, genreId, ...rest } = data;
    
    try {
        const bookId = Number(bookIdString);
        
        if (isNaN(bookId)) {
            throw new Error("ID do livro inválido para a atualização.");
        }

        // --- APLICANDO CORREÇÕES ---
        // 1. Corrigindo o erro 2551 (genre -> genreId)
        // 2. Corrigindo o erro 2322 (null -> undefined)
        const genreIdValue = getGenreIdUpdateValue(genreId);

        await prisma.book.update({
            where: { id: bookId }, 
            data: {
                title: data.title,
                author: data.author,
                status: data.status as any,
                
                // Mapeamento de Campos:
                pages: totalPages,         
                currentPage: currentPage ?? 0, 
                rating: rest.rating,
                cover: coverUrl,        
                notes: personalNotes,  
                year: rest.year,
                synopsis: rest.synopsis,
                isbn: rest.isbn,
                
                // CORREÇÃO do erro 2322 e 2551:
                genreId: genreIdValue, 
            },
        });

        revalidatePath("/library", "page");
        revalidatePath(`/edit-book/${bookIdString}`);
        redirect("/library");

    } catch (error: any) {
        if (error.message.includes("NEXT_REDIRECT")) {
            throw error;
        }

        console.error("❌ Erro ao atualizar livro via bookActionsClient:", error);
        throw new Error("Falha ao salvar o livro no banco de dados. " + (error.message || "Erro desconhecido."));
    }
}