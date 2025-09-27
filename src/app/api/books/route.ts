// app/api/books/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const books = await prisma.book.findMany();


const DATA_PATH = path.join(process.cwd(), "data", "books.json");

async function readBooks() {
  try {
    const txt = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(txt);
  } catch (err) {
    return [];
  }
}

async function writeBooks(books: any[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(books, null, 2), "utf-8");
}

export async function GET() {
  const books = await readBooks();
  return NextResponse.json(books);
}

export async function POST(req: Request) {
  const body = await req.json();
  const books = await readBooks();
  books.push(body);
  await writeBooks(books);
  return NextResponse.json(body, { status: 201 });
}
