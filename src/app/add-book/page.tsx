import { Suspense } from "react";
import FormToast from "@/components/FormToast";
import { BookFormClient } from "./BookFormClient";
import prisma from "@/lib/prisma";

export default async function AddBookPage() {
  let categories = [];

  try {
    categories = await prisma.genre.findMany({
      orderBy: { name: "asc" },
    });

    // Se não existir nenhum gênero, cria alguns padrões
    if (categories.length === 0) {
      categories = await prisma.$transaction([
        prisma.genre.create({ data: { name: "Romance" } }),
        prisma.genre.create({ data: { name: "Fantasia" } }),
        prisma.genre.create({ data: { name: "Programação" } }),
        prisma.genre.create({ data: { name: "Tecnologia" } }),
        prisma.genre.create({ data: { name: "Outro" } }),
      ]);
    }
  } catch (e) {
    console.warn("⚠️ Falha ao conectar ao banco. Usando categorias mockadas.");
    categories = [
      { id: 1, name: "Romance" },
      { id: 2, name: "Programação" },
      { id: 3, name: "Fantasia" },
      { id: 4, name: "Tecnologia" },
      { id: 5, name: "Outro" },
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
