// src/app/api/categories/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Confirme se o caminho para o prisma está correto

// GET /api/categories - Listar todas as categorias/gêneros
export async function GET() {
    try {
        const genres = await prisma.genre.findMany({
            orderBy: { name: 'asc' }, 
        });
        return NextResponse.json(genres);
    } catch (error) {
        console.error("GET /api/categories error:", error);
        return NextResponse.json(
            { error: "Failed to fetch genres" },
            { status: 500 }
        );
    }
}

// POST /api/categories - Adicionar novo gênero 
export async function POST(request: Request) {
    try {
        const { name } = await request.json();

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return NextResponse.json(
                { error: "Nome do gênero inválido" },
                { status: 400 }
            );
        }

        const genre = await prisma.genre.create({
            data: {
                name: name.trim(),
            },
        });

        return NextResponse.json(genre, { status: 201 });
    } catch (error: any) {
        // Trata erro de gênero já existente (violacão de unicidade)
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "Gênero já existe" },
                { status: 409 }
            );
        }
        console.error("POST /api/categories error:", error);
        return NextResponse.json(
            { error: "Failed to create genre" },
            { status: 500 }
        );
    }
}