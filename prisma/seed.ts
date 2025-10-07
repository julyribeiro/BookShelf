// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { initialGenres, initialBooks } from "./seedData";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Limpando tabelas...");
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();

  console.log("📚 Inserindo gêneros...");
  const createdGenres = [];
  for (const genre of initialGenres) {
    const created = await prisma.genre.create({ data: genre });
    createdGenres.push(created);
  }

  console.log("📖 Inserindo livros...");
  for (const book of initialBooks) {
    // Evita erro de tipo e garante associação correta
    const genreIndex = (book as any).genreId ? (book as any).genreId - 1 : 0;
    const genre = createdGenres[genreIndex];

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
        genreId: genre?.id ?? null, // Fallback seguro
      },
    });
  }

  console.log("✅ Seed finalizado com sucesso!");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Erro ao executar seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
