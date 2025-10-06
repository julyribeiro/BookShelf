// src/app/book/[id]/page.tsx

import { notFound } from "next/navigation";
import { getBookById } from "@/data/books";
import BookDetailView from "./BookDetailView";
import { Metadata } from "next"; 


type BookDetailsPageProps = {
    params: {
        id: string;
    };

    searchParams?: { [key: string]: string | string[] | undefined }; 
};


export default async function BookDetailsPage({ params }: BookDetailsPageProps) {
    
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

export async function generateMetadata({ params }: BookDetailsPageProps): Promise<Metadata> {
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