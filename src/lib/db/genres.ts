import { prisma } from "@/lib/prisma";

export async function getGenres() {
  return prisma.genre.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createGenre(name: string) {
  return prisma.genre.create({
    data: { name },
  });
}
