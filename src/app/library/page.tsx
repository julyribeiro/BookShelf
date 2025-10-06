import LibraryClientWrapper from "./LibraryClientWrapper"; 
import { ReadingStatus, Book, Genre } from "@prisma/client";
// Importe apenas initialBooks, que é um array local e seguro.
import { initialBooks } from "@/data/books"; 

// --- TIPAGEM AUXILIAR ---
// Tipagens simplificadas para o contexto de dados mockados
type BookWithGenre = Book & {
  genre: Genre | null;
};

interface LibraryPageProps {
  searchParams: {
    status?: string;
  };
}
// ------------------------------------

// --- SERVER COMPONENT: Contorno de Erro de Build ---
export default async function LibraryPage(props: any) {
  const { searchParams } = props as LibraryPageProps;
  
  const statusFilter = searchParams.status as ReadingStatus | undefined;

  // 🛑 USANDO APENAS DADOS MOCKADOS
  // initialBooks já tem 'id' como string, atendendo ao tipo 'Book[]' do Front-end.
  const booksWithGenre = initialBooks as any; 
  
  // Criadas listas de gêneros manualmente, pois não podemos buscar no DB.
  // Gêneros (string[]): Lista de nomes para filtros.
  const genres: string[] = ["Romance", "Programação", "Fantasia", "Tecnologia", "Outro"]; 

  // Categories (Genre[]): Lista de objetos. Ustilizado um array vazio para o build passar.
  // OBS: Será necessário ajustar isso se o componente usar os objetos completos.
  const categories: Genre[] = []; 

  return (
    <LibraryClientWrapper 
      initialBooks={booksWithGenre} 
      genres={genres}        // Prop 1: Array de strings (nome dos gêneros)
      categories={categories} // Prop 2: Array de objetos (vazio para passar o build)
      initialStatus={statusFilter ?? ''} 
    />
  );
}