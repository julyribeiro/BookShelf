// src/app/api/categories/genres/[name]/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/categories/genres/[name] -> Remove um gênero pelo nome
 */
export async function DELETE(
  req: NextRequest,
  context: any // Correção final para o erro de tipagem no build do Vercel
) {
  try {
    // Acessa o parâmetro 'name' internamente
    const { name } = context.params; 

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json({ error: "Nome do gênero inválido" }, { status: 400 });
    }

    const deletedGenre = await prisma.genre.delete({
      where: { name: name },
    });

    return NextResponse.json({ 
        message: `Gênero '${deletedGenre.name}' deletado com sucesso.`,
        genre: deletedGenre 
    });

  } catch (error: any) {
    // Trata erro se o gênero não for encontrado
    if (error.code === 'P2025') {
        return NextResponse.json({ error: "Gênero não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ error: "Erro ao deletar gênero" }, { status: 500 });
  }
}