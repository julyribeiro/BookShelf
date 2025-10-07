// src/app/library/page.tsx

import LibraryClientWrapper from "./LibraryClientWrapper"; 
import { ReadingStatus, Genre } from "@prisma/client";
import { getBooks, getAllGenres } from "@/data/books"; 

interface LibraryPageProps {
  searchParams: {
    status?: string;
  };
}

// --- SERVER COMPONENT: BUSCA DE DADOS REAIS DO NEON ---
export default async function LibraryPage(props: LibraryPageProps) {
  const { searchParams } = props;
  
  const statusFilter = searchParams.status as ReadingStatus | undefined;

  // 🛑 EXECUTA A BUSCA REAL
  const booksWithGenre = await getBooks();
  const categories = await getAllGenres(); // Busca a lista completa de gêneros
  
  // Mapeia a lista de objetos de Gêneros para a lista de strings
  const genres: string[] = categories.map(c => c.name);

  return (
    <LibraryClientWrapper 
      initialBooks={booksWithGenre} 
      genres={genres} 
      categories={categories} // Envia a lista completa de objetos de Gênero para o Client Component
      initialStatus={statusFilter ?? ''} 
    />
  );
}