// src/actions/genreActions.ts

"use server";

import { prisma } from "@/lib/prisma";

// Define o tipo de retorno da função
// O tipo Genre é inferido do modelo Prisma
export type Genre = Awaited<ReturnType<typeof prisma.genre.findMany>>[number];

/**
 * Busca todos os gêneros disponíveis no banco de dados.
 *
 * @returns {Promise<Genre[]>} Uma lista de objetos Genre.
 */
export async function getGenres(): Promise<Genre[]> {
    try {
        const genres = await prisma.genre.findMany({
            orderBy: { name: 'asc' }, // Ordena por nome
        });


        return genres;
    } catch (error) {
        console.error("❌ Erro ao buscar gêneros:", error);
        // Em caso de erro, retorna um array vazio para não quebrar a aplicação
        return []; 
    }
}