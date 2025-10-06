// src/app/add-book/page.tsx

import { prisma } from "@/lib/prisma";
import FormToast from "@/components/FormToast";
import { BookFormClient } from "./BookFormClient";

interface Category {
  id: number;
  name: string;
}

export default async function AddBookPage() {
  // Busca de dados no servidor
  const categories: Category[] = await prisma.genre.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true }
  });
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Adicionar Novo Livro</h1>
      
      <FormToast /> 

      {/* Passa os dados buscados para o componente cliente */}
      <BookFormClient categories={categories} />
    </div>
  );
}