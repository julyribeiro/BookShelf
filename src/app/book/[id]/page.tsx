// src/app/book/[id]/page.tsx

import { notFound } from "next/navigation";
import { getBookById } from "@/data/books";
import BookDetailView from "./BookDetailView"; 
import { Metadata } from "next"; 

interface BookDetailsPageProps {
    params: {
        id: string;
    };
    searchParams?: { [key: string]: string | string[] | undefined }; 
}

export default async function BookDetailsPage(props: any) {
    const { params } = props as BookDetailsPageProps; 

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

export async function generateMetadata(props: any): Promise<Metadata> {
    const { params } = props as BookDetailsPageProps; 

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