// src/app/add-book/page.tsx

import { Suspense } from "react";
import FormToast from "@/components/FormToast";
import { BookFormClient } from "./BookFormClient";
import { prisma } from "@/lib/prisma";
import { Genre } from "@prisma/client";

export default async function AddBookPage() {
  let categories: Genre[] = [];

  try {
    // Busca os gêneros no banco de dados (Neon)
    categories = await prisma.genre.findMany({
      orderBy: { name: "asc" },
    });
  } catch (e) {
    // Fallback: Se o Neon falhar, usa categorias mockadas para evitar que o form quebre
    console.error("❌ Falha ao buscar gêneros no banco de dados.", e);
    categories = [
      { id: 1, name: "Romance" } as Genre,
      { id: 2, name: "Programação" } as Genre,
      { id: 3, name: "Fantasia" } as Genre,
      { id: 4, name: "Tecnologia" } as Genre,
      { id: 5, name: "Outro" } as Genre,
    ];
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Adicionar Novo Livro</h1>

      <Suspense fallback={<div>Carregando Formulário...</div>}>
        <FormToast />
        <BookFormClient categories={categories} />
      </Suspense>
    </div>
  );
}