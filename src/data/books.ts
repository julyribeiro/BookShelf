// src/data/books.ts

import { prisma } from "@/lib/prisma";
import Book from "@/types/book";
import { Book as PrismaBook, Genre } from "@prisma/client";
import { unstable_noStore } from 'next/cache'; 

export type ReadingStatus = 'QUERO_LER' | 'LENDO' | 'LIDO' | 'PAUSADO' | 'ABANDONADO';

export type BookWithGenre = PrismaBook & { genre: Genre | null };

// Mapeador centralizado: transforma o objeto do Prisma no objeto Book do seu frontend
const mapPrismaToBook = (book: BookWithGenre): Book => ({
    id: String(book.id), 
    title: book.title,
    author: book.author,
    year: book.year || 0,
    cover: book.cover || undefined,
    rating: book.rating || 0,
    status: (book.status || "QUERO_LER") as ReadingStatus, 
    genre: book.genre?.name || 'Sem Gênero', 
    synopsis: book.synopsis || undefined,
    notes: book.notes || undefined,
    pages: book.pages || undefined,
});

// FUNÇÃO: Busca todos os livros no Neon
export async function getBooks(): Promise<Book[]> {
    unstable_noStore();
    const prismaBooks = await prisma.book.findMany({
        include: { genre: true },
        orderBy: { createdAt: "desc" },
    });
    return prismaBooks.map(mapPrismaToBook);
}

// FUNÇÃO: Busca um livro por ID no Neon
export async function getBookById(id: string): Promise<Book | undefined> {
    unstable_noStore();
    const prismaBook = await prisma.book.findUnique({
        where: { id: Number(id) }, 
        include: { genre: true },
    });
    return prismaBook ? mapPrismaToBook(prismaBook) : undefined;
}

// FUNÇÃO: Busca todos os Gêneros no Neon
export async function getAllGenres(): Promise<Genre[]> {
    unstable_noStore();
    return prisma.genre.findMany({
        orderBy: { name: 'asc' }
    });
}

export type { Book };