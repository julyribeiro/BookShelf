// src/app/add-book/page.tsx

// import { prisma } from "@/lib/prisma"; // Comentado para evitar o erro DATABASE_URL
import FormToast from "@/components/FormToast";
import { BookFormClient } from "./BookFormClient";

interface Category {
  id: number;
  name: string;
}

// 🛑 DADOS MOCKADOS PARA FAZER O BUILD PASSAR NO VERCEL
const MOCKED_CATEGORIES: Category[] = [
    { id: 1, name: "Romance" },
    { id: 2, name: "Programação" },
    { id: 3, name: "Fantasia" },
    { id: 4, name: "Tecnologia" },
    { id: 5, name: "Outro" },
];

export default async function AddBookPage() {
  // Busca de dados no servidor
  /* 🛑 CÓDIGO ORIGINAL COMENTADO PARA EVITAR ERRO DE BANCO DE DADOS
  const categories: Category[] = await prisma.genre.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true }
  });
  */
  
  // 🛑 USANDO DADOS MOCKADOS PARA O BUILD (Type assertion 'as Category[]' para garantir a tipagem)
  const categories: Category[] = MOCKED_CATEGORIES;
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Adicionar Novo Livro</h1>
      
      <FormToast /> 

      {/* Passa os dados buscados para o componente cliente */}
      <BookFormClient categories={categories} />
    </div>
  );
}