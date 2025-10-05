// src/app/api/categories/genres/[name]/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Tipagem para capturar o parâmetro dinâmico '[name]' da URL
type RouteContext<T extends string> = { params: { [K in T]: string } };

/**
 * DELETE /api/categories/genres/[name] -> Remove um gênero pelo nome
 * Nota: O nome do parâmetro na URL é 'name', que mapeia para o campo 'name' no Genre.
 */
export async function DELETE(
  req: NextRequest,
  ctx: RouteContext<'name'>
) {
  try {
    const { name } = ctx.params;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json({ error: "Nome do gênero inválido" }, { status: 400 });
    }

    // Tenta deletar o gênero pelo nome, que é o campo único.
    const deletedGenre = await prisma.genre.delete({
      where: { name: name },
    });

    // Resposta de sucesso (200 OK)
    return NextResponse.json({ 
        message: `Gênero '${deletedGenre.name}' deletado com sucesso.`,
        genre: deletedGenre 
    });

  } catch (error: any) {
    // Trata erro se o gênero não for encontrado (código P2025 do Prisma)
    if (error.code === 'P2025') {
        return NextResponse.json({ error: "Gênero não encontrado." }, { status: 404 });
    }

    console.error("DELETE /api/categories/genres/[name] error:", error);
    return NextResponse.json({ error: "Erro ao deletar gênero" }, { status: 500 });
  }
}