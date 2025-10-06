// src/app/book/[id]/page.tsx

import { notFound } from "next/navigation";
import { getBookById } from "@/data/books";
import BookDetailView from "./BookDetailView"; 

type PageParams = {
    id: string;
};

// Componente principal
export default async function BookDetailsPage({ params }: { params: PageParams }) {
    
    // Server-side fetch
    const book = await getBookById(params.id);

    if (!book) {
        return notFound();
    }

    // Passa os dados para o Client Component
    return (
        <main>
            <BookDetailView book={book} />
        </main>
    );
}

// Opcional: Adiciona metadados
export async function generateMetadata({ params }: { params: PageParams }) {
    const book = await getBookById(params.id);

    if (!book) {
        return {
            title: 'Livro não encontrado',
        };
    }

    return {
        title: book.title,
        description: `Detalhes do livro: ${book.title}`,
    };
}