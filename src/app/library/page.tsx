import { Suspense } from "react";
import { getBooks } from "@/data/books";
import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Book from "@/types/book";
import LibraryClientWrapper from "./LibraryClientWrapper";

const DYNAMIC_GENRES = [
  "Todos os Gêneros",
  "Literatura Brasileira",
  "Ficção Científica",
  "Realismo Mágico",
  "Ficção",
  "Fantasia",
  "Romance",
  "Biografia",
  "História",
  "Autoajuda",
  "Tecnologia",
  "Programação",
  "Negócios",
  "Psicologia",
  "Filosofia",
  "Poesia",
];

export default async function LibraryPage({ 
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  // CORRIGIDO: Adicionado 'await' para resolver a Promise (TS2740)
  const initialBooks: Book[] = await getBooks(); 
  
  const initialStatus = searchParams.status || "Todos os Status";

  return (
    <Suspense fallback={<div>Carregando informações da sua biblioteca…</div>}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-foreground">Minha Biblioteca</h1>
          <Button asChild>
            <Link href="/add-book" className="flex items-center">
              <FaPlus className="mr-2" />
              <span>Adicionar Livro</span>
            </Link>
          </Button>
        </div>

        <LibraryClientWrapper
          initialBooks={initialBooks}
          initialStatus={initialStatus}
          genres={DYNAMIC_GENRES}
        />
      </div>
    </Suspense>
  );
}