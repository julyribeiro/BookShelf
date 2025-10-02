// src/app/api/books/[id]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * GET  /api/books/[id]  -> retorna 1 livro
 * PUT  /api/books/[id]  -> atualiza um livro (aceita genre como string para conectar/criar)
 * DELETE /api/books/[id] -> deleta o livro
 *
 * Note: usa RouteContext<'/api/books/[id]'> (helper global do Next) para tipar params.
 */

export async function GET(
  req: NextRequest,
  ctx: RouteContext<'/api/books/[id]'>
) {
  try {
    const { id } = await ctx.params;
    const bookId = Number(id);
    if (Number.isNaN(bookId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: { genre: true },
    });

    if (!book) {
      return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("GET /api/books/[id] error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<'/api/books/[id]'>
) {
  try {
    const { id } = await ctx.params;
    const bookId = Number(id);
    if (Number.isNaN(bookId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();

    // Monta um objeto seguindo os tipos do Prisma
    const updateData: Prisma.BookUpdateInput = {
      title: body.title ?? undefined,
      author: body.author ?? undefined,
      year: (body.year ?? undefined) as number | undefined,
      pages: (body.pages ?? undefined) as number | undefined,
      rating: (body.rating ?? undefined) as number | undefined,
      synopsis: body.synopsis ?? undefined,
      cover: body.cover ?? undefined,
      status: (body.status ?? undefined) as any, // enum ReadingStatus - será validado pelo Prisma
      currentPage: (body.currentPage ?? undefined) as number | undefined,
      isbn: body.isbn ?? undefined,
      notes: body.notes ?? undefined,
    };

    // Se o cliente enviou genre como string (nome), conecta ou cria o gênero
    if (typeof body.genre === "string" && body.genre.trim() !== "") {
      updateData.genre = {
        connectOrCreate: {
          where: { name: body.genre },
          create: { name: body.genre },
        },
      } as any; // conecta/ cria nested input (tipagem complexa do Prisma)
    }

    const updated = await prisma.book.update({
      where: { id: bookId },
      data: updateData,
      include: { genre: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/books/[id] error:", error);
    return NextResponse.json({ error: "Erro ao atualizar livro" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  ctx: RouteContext<'/api/books/[id]'>
) {
  try {
    const { id } = await ctx.params;
    const bookId = Number(id);
    if (Number.isNaN(bookId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.book.delete({
      where: { id: bookId },
    });

    return NextResponse.json({ message: "Livro deletado com sucesso" });
  } catch (error) {
    console.error("DELETE /api/books/[id] error:", error);
    return NextResponse.json({ error: "Erro ao deletar livro" }, { status: 500 });
  }
}

