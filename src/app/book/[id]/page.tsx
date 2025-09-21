"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { books } from "../../../data/books";

export default function BookDetailPage() {
    const { id } = useParams();
    const book = books.find((b) => b.id === id);

    if (!book) {
        return <div className="p-6">Livro não encontrado.</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full max-w-sm">
                    <Image
                        src={book.cover || "/fallback.jpg"}
                        alt={book.title}
                        width={300}
                        height={450}
                        className="rounded-xl object-contain"
                    />
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                    <p className="text-lg text-gray-700">{book.author}</p>
                    <p className="text-sm text-gray-500 mb-4">
                        {book.year} • {book.genre} • {book.pages} páginas
                    </p>
                    <p className="text-base text-gray-800">{book.synopsis}</p>
                </div>
            </div>
        </div>
    );
}
