"use client";

import Image from "next/image";
import Link from "next/link";
import { books } from "../../data/books";
import { Star } from "lucide-react";

export default function LibraryPage() {
  return (
    <div className="p-16">
      <h1 className="text-3xl font-bold mb-6">Biblioteca</h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-card border border-gray-200 rounded-2xl shadow-md p-4 flex flex-col"
          >
            {/* Capa */}
            <div className="relative w-full h-72 mb-4">
              <Image
                src={book.cover || ""}
                alt={book.title}
                fill
                className="object-contain rounded-xl"
              />
            </div>

            {/* Info */}
            <h2 className="font-semibold text-lg mb-1">{book.title}</h2>
            <p className="text-sm text-gray-600">{book.author}</p>
            <p className="text-xs text-gray-500">
              {book.year} • {book.genre}
            </p>

            {/* Rating */}
            <div className="flex items-center mt-2 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i <= Math.round(book.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {book.rating.toFixed(1)}
              </span>
            </div>

            {/* Botões */}
            <div className="mt-auto flex gap-2">
              <Link
                href={`/book/${book.id}`}
                className="flex-1 bg-blue-500 text-white text-sm py-2 px-3 rounded-lg hover:bg-blue-600 text-center"
              >
                Visualizar
              </Link>
              <button className="flex-1 bg-yellow-500 text-white text-sm py-2 px-3 rounded-lg hover:bg-yellow-600">
                Editar
              </button>
              <button className="flex-1 bg-red-500 text-white text-sm py-2 px-3 rounded-lg hover:bg-red-600">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
