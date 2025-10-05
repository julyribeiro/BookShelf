// scripts/import-from-data.ts
import { prisma } from "../src/lib/prisma";
import { initialBooks } from "../src/data/books";
import Book from "../src/types/book"

async function main() {
  console.log("📚 Importando livros iniciais do data.ts...");

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

        // Relacionamento com Genre - garante string
        genre: {
          connectOrCreate: {
            where: { name: book.genre ?? "Sem gênero" },
            create: { name: book.genre ?? "Sem gênero" },
          },
        },
      },
    });
  }

  console.log("✅ Livros importados com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao importar livros:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
