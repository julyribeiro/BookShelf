// app/api/books/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DATA_PATH = path.join(process.cwd(), "data", "books.json");

async function readBooks() {
  try {
    const txt = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(txt);
  } catch {
    return [];
  }
}

async function writeBooks(books: any[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(books, null, 2), "utf-8");
}

// ✅ Ajuste aqui: params é uma Promise
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const books = await readBooks();
  const book = books.find((b: any) => b.id === id);
  if (!book) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(book);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const payload = await req.json();
  const books = await readBooks();
  const idx = books.findIndex((b: any) => b.id === id);
  if (idx === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });
  books[idx] = { ...books[idx], ...payload };
  await writeBooks(books);
  return NextResponse.json(books[idx]);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const books = await readBooks();
  const updated = books.filter((b: any) => b.id !== id);
  await writeBooks(updated);
  return NextResponse.json({ message: "Deleted" });
}

