import { getBooks, getAllGenres } from "@/data/books"; // 🛑 CORREÇÃO FINAL: Usando 'getAllGenres'
import LibraryClientWrapper from "./LibraryClientWrapper"; 
import { ReadingStatus, Book, Genre } from "@prisma/client";

// --- TIPAGEM AUXILIAR ---
type BookWithGenre = Book & {
  genre: Genre | null;
};

interface LibraryPageProps {
  searchParams: {
    status?: string;
  };
}
// ------------------------------------

// --- SERVER COMPONENT: Busca de Dados ---
export default async function LibraryPage(props: any) {
  const { searchParams } = props as LibraryPageProps;
  
  const statusFilter = searchParams.status as ReadingStatus | undefined;

  // Busca de dados
  const [books, rawGenresObjects] = await Promise.all([
    getBooks(), 
    getAllGenres(), // 🛑 Chamada com o nome 'getAllGenres'
  ]);

  // 1. Prepara a lista de objetos para a prop 'categories'
  const categories: Genre[] = rawGenresObjects;
  
  // 2. Prepara a lista de strings para a prop 'genres'
  const genres: string[] = rawGenresObjects.map((g: { name: string, id: number }) => g.name);

  // Mapeamento e conversão de ID para string (mantido)
  const booksWithGenre = books.map((book: any) => ({
    ...book,
    id: String(book.id), 
    genre: book.genre ?? null,
  })) as any; 

  return (
    <LibraryClientWrapper 
      initialBooks={booksWithGenre} 
      genres={genres}        // Prop 1: Array de strings (nome dos gêneros)
      categories={categories} // Prop 2: Array de objetos (os objetos Genre[] completos)
      initialStatus={statusFilter ?? ''} 
    />
  );
}