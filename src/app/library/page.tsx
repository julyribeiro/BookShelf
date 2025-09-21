"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { books as initialBooks } from "../../data/books";
import { Star } from "lucide-react";

export default function LibraryPage() {
  const [books, setBooks] = useState(initialBooks);
  const [editingBook, setEditingBook] = useState<any>(null); // livro em edição

  const handleDelete = (id: string) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
  };

  const handleEdit = (book: any) => {
    setEditingBook(book);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingBook) return;

    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === editingBook.id ? editingBook : book
      )
    );
    setEditingBook(null); // fecha modal
  };

  const handleRating = (id: string, rating: number) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id ? { ...book, rating } : book
      )
    );
  };

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
                <button
                  key={i}
                  onClick={() => handleRating(book.id, i)}
                  className="focus:outline-none"
                >
                  <Star
                    size={16}
                    className={`${
                      i <= Math.round(book.rating ?? 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {(book.rating ?? 0).toFixed(1)}
              </span>
            </div>

            {/* Botões */}
            <div className="mt-auto flex flex-wrap gap-2">
              <Link
                href={`/book/${book.id}`}
                className="flex-1 min-w-[100px] bg-blue-500 text-white text-sm py-2 px-3 rounded-lg hover:bg-blue-600 text-center"
              >
                Visualizar
              </Link>
              <button
                onClick={() => handleEdit(book)}
                className="flex-1 min-w-[100px] bg-yellow-500 text-white text-sm py-2 px-3 rounded-lg hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(book.id)}
                className="flex-1 min-w-[100px] bg-red-500 text-white text-sm py-2 px-3 rounded-lg hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edição */}
      {editingBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Editar Livro</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <input
                type="text"
                value={editingBook.title}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, title: e.target.value })
                }
                placeholder="Título"
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                value={editingBook.author}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, author: e.target.value })
                }
                placeholder="Autor"
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                value={editingBook.genre}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, genre: e.target.value })
                }
                placeholder="Gênero"
                className="border p-2 rounded"
              />
              <input
                type="number"
                value={editingBook.year}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    year: Number(e.target.value),
                  })
                }
                placeholder="Ano"
                className="border p-2 rounded"
              />
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
