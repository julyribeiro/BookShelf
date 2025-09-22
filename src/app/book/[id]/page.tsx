// src/app/book/[id]/page.tsx

"use client";

import React from "react";
import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { getBooks, updateBooks } from "@/data/books";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import StarRating from "@/components/StarRating";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

export default function BookDetailsPage({
  params,
}: {
  params: promise <{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const { toast } = useToast();

  const allBooks = getBooks();
  const book = allBooks.find((b) => b.id === id);

  if (!book) {
    notFound();
  }

  const handleDelete = () => {
    const updatedBooks = allBooks.filter((b) => b.id !== book.id);
    updateBooks(updatedBooks);
    
    // Adicionando a notificação de sucesso
    toast({
      title: "Livro excluído!",
      description: "O livro foi removido da sua biblioteca com sucesso.",
    });

    // Adiciona um atraso para o usuário ver o "toast"
    setTimeout(() => {
      router.push("/library");
    }, 500); // 500 milissegundos = 0.5 segundos
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button asChild>
          <Link href="/library" className="flex items-center">
            <FaArrowLeft className="mr-2" />
            Voltar para a Biblioteca
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 flex-shrink-0">
          <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg border border-gray-100">
            {book.cover ? (
              <Image
                src={book.cover}
                alt={`Capa do livro ${book.title}`}
                fill
                style={{ objectFit: "contain" }}
                className="rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
                Sem Capa
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <Button asChild className="flex-1">
              <Link href={`/edit-book/${book.id}`}>
                <FaEdit className="mr-2" /> Editar
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  <FaTrash className="mr-2" /> Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso removerá
                    permanentemente o livro da sua biblioteca.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Continuar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">{book.title}</h1>
          <p className="text-xl text-gray-600">por {book.author}</p>

          <div className="flex flex-wrap items-center gap-4">
            {book.genre && (
              <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                {book.genre}
              </span>
            )}
            {book.status && (
              <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
                {book.status.replace("_", " ").toUpperCase()}
              </span>
            )}
            <div className="flex items-center gap-1">
              <StarRating rating={book.rating || 0} />
              <span className="text-gray-600">
                ({(book.rating || 0).toFixed(1)})
              </span>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {book.synopsis}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>Páginas:</strong> {book.pages || "N/A"}
            </p>
            <p>
              <strong>Ano de Publicação:</strong> {book.year || "N/A"}
            </p>
            {book.isbn && (
              <p>
                <strong>ISBN:</strong> {book.isbn}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}