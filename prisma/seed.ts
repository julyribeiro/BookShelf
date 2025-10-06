// prisma/seed.ts

import { prisma } from "../src/lib/prisma";
import { initialBooks } from "../src/data/books";

async function main() {
  
  // Lista Mestra de Gêneros (Completa para o formulário de Adição)
  const baseGenres = [
    { name: "Literatura Brasileira" },
    { name: "Ficção Científica" },
    { name: "Realismo Mágico" },
    { name: "Fantasia" },
    { name: "Romance" },
    { name: "Biografia" },
    { name: "História" },
    { name: "Autoajuda" },
    { name: "Tecnologia" },
    { name: "Programação" },
    { name: "Negócios" },
    { name: "Psicologia" },
    { name: "Filosofia" },
    { name: "Poesia" },
    { name: "Outro" },
    { name: "Sem gênero" } 
  ];

  console.log("🌱 Iniciando seed: Gêneros e Livros...");

  // 1. CRIA/ATUALIZA A LISTA MESTRA COMPLETA DE GÊNEROS (RESOLVE O PROBLEMA DO FORMULÁRIO)
  for (const genre of baseGenres) {
    await prisma.genre.upsert({
      where: { name: genre.name },
      update: {}, // Não faz nada se já existir
      create: genre, // Cria se não existir
    });
  }
  console.log("✅ Gêneros base inseridos/atualizados.");

  // --- RECOMENDAÇÃO: Limpar livros de teste antes de inserir ---
  // Isso evita duplicação de livros se você rodar o seed várias vezes
  // Se quiser manter os livros existentes, comente a linha abaixo.
  await prisma.book.deleteMany(); 
  console.log("⚠️ Livros existentes removidos (para evitar duplicação).");


  // 2. CRIA OS LIVROS DE TESTE (LÓGICA DO COLEGA INTEGRADA)
  for (const book of initialBooks) {
    await prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        year: book.year,
        pages: book.pages,
        rating: book.rating,
        synopsis: book.synopsis,
        cover: book.cover,
        status: book.status,
        currentPage: book.currentPage ?? 0,
        isbn: book.isbn,
        notes: book.notes,
        
        // CONECTA o livro ao GÊNERO JÁ CRIADO (porque garantimos que ele existe no passo 1)
        genre: {
          connect: { 
            name: book.genre ?? "Sem gênero"
          },
        },
      },
    });
  }

  console.log("✅ Livros iniciais importados com sucesso!");
  console.log("✅ Seed concluído!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro no seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });