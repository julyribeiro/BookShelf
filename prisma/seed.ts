// prisma/seed.ts
import { prisma } from "../src/lib/prisma";

async function main() {
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
  ];

  console.log("🌱 Iniciando seed do banco...");

  for (const genre of baseGenres) {
    await prisma.genre.upsert({
      where: { name: genre.name },
      update: {},
      create: genre,
    });
  }

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

