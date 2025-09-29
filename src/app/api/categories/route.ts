// app/api/categories/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const books = await prisma.book.findMany();


const DATA_PATH = path.join(process.cwd(), "data", "categories.json");

async function readCats() {
  try {
    const txt = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(txt);
  } catch (err) {
    return [];
  }
}

async function writeCats(items: unknown[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(items, null, 2), "utf-8");
}

export async function GET() {
  const items = await readCats();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const { genre } = await req.json();
  if (!genre) return NextResponse.json({message: "genre required"}, { status: 400 });
  const items = await readCats();
  if (!items.includes(genre)) items.push(genre);
  await writeCats(items);
  return NextResponse.json({ genre }, { status: 201 });
}

export async function DELETE(req: Request) {
  const { genre } = await req.json();
  if (!genre) return NextResponse.json({ message: "genre required" }, { status: 400 });
  const items = await readCats();
  const updated = items.filter((g: string) => g !== genre);
  await writeCats(updated);
  return NextResponse.json({ message: "deleted" });
}
