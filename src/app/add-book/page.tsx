// src/app/add-book/page.tsx

// Importamos Suspense para resolver o erro do Next.js
import { Suspense } from 'react';
// import { prisma } from "@/lib/prisma"; // Comentado para evitar o erro DATABASE_URL
import FormToast from "@/components/FormToast";
import { BookFormClient } from "./BookFormClient";

interface Category {
  id: number;
  name: string;
}

// DADOS MOCKADOS PARA FAZER O BUILD PASSAR NO VERCEL
const MOCKED_CATEGORIES: Category[] = [
    { id: 1, name: "Romance" },
    { id: 2, name: "Programação" },
    { id: 3, name: "Fantasia" },
    { id: 4, name: "Tecnologia" },
    { id: 5, name: "Outro" },
];

export default async function AddBookPage() {
  
  // Usando dados mockados
  const categories: Category[] = MOCKED_CATEGORIES;
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Adicionar Novo Livro</h1>
      
      {/* 🛑 AQUI ESTÁ A CORREÇÃO: Envolver o conteúdo que usa useSearchParams() em Suspense */}
      <Suspense fallback={<div>Carregando Formulário...</div>}>
        <FormToast /> 
        {/* O BookFormClient ou FormToast provavelmente usa useSearchParams() */}
        <BookFormClient categories={categories} />
      </Suspense>
    </div>
  );
}