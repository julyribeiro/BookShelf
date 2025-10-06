import { prisma } from "@/lib/prisma";
import Book from "@/types/book";
import { Book as PrismaBook, Genre } from "@prisma/client";

export type ReadingStatus = 'QUERO_LER' | 'LENDO' | 'LIDO' | 'PAUSADO' | 'ABANDONADO';

type BookWithGenre = PrismaBook & { genre: Genre | null };

export const initialBooks: Book[] = []; 

// Mapeador centralizado para garantir consistência e inclusão de todos os campos
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

export async function getBooks(): Promise<Book[]> {
  try {
    const booksWithGenre = await prisma.book.findMany({
      include: {
        genre: true,
      },
      orderBy: {
        title: 'asc',
      },
    }) as BookWithGenre[];

    return booksWithGenre.map(mapPrismaToBook);
  } catch (error) {
    console.error("Erro ao buscar livros do banco de dados:", error);
    return []; 
  }
}

export async function getBookById(id: string): Promise<Book | undefined> {
  try {
    const numericId = Number(id);
    
    const book = await prisma.book.findUnique({
      where: { id: numericId }, 
      include: { genre: true} 
    }) as (BookWithGenre | null);

    if (!book) return undefined;

    return mapPrismaToBook(book);
    
  } catch (error) {
    console.error("Erro ao buscar livro único:", error);
    return undefined;
  }
}

export const addBook = (book: Book): void => {
  console.warn("addBook stub chamado.");
};

export const updateBooks = (updatedBooks: Book[]): void => {
  console.warn("updateBooks stub chamado.");
};

export const updateBook = (updatedBook: Book): void => {
  console.warn("updateBook stub chamado.");
};

export type { Book };