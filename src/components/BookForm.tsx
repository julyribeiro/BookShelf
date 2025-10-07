"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBook, updateBook } from "@/lib/actions";

interface BookFormProps {
  initialData?: {
    id?: number;
    title?: string;
    author?: string;
    year?: number | string | null;
    pages?: number | string | null;
    rating?: number | string | null;
    synopsis?: string | null;
    cover?: string | null;
    status?: string;
    genreId?: number | string | null;
  };
}

export default function BookForm({ initialData }: BookFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    author: initialData?.author || "",
    year: initialData?.year || "",
    pages: initialData?.pages || "",
    rating: initialData?.rating || "",
    synopsis: initialData?.synopsis || "",
    cover: initialData?.cover || "",
    status: initialData?.status || "QUERO_LER",
    genreId: initialData?.genreId || "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (initialData?.id) {
        await updateBook(initialData.id, formData);
        alert("✅ Livro atualizado com sucesso!");
      } else {
        await createBook(formData);
        alert("✅ Livro criado com sucesso!");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao salvar livro:", error);
      alert("❌ Ocorreu um erro ao salvar o livro.");
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 space-y-4 bg-white rounded-xl shadow-md"
    >
      <h1 className="text-2xl font-semibold">
        {initialData?.id ? "Editar Livro" : "Adicionar Livro"}
      </h1>

      <input
        type="text"
        name="title"
        placeholder="Título"
        value={formData.title}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />

      <input
        type="text"
        name="author"
        placeholder="Autor"
        value={formData.author}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />

      <input
        type="number"
        name="year"
        placeholder="Ano"
        value={formData.year}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="number"
        name="pages"
        placeholder="Páginas"
        value={formData.pages}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="number"
        step="0.1"
        name="rating"
        placeholder="Avaliação"
        value={formData.rating}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <textarea
        name="synopsis"
        placeholder="Sinopse"
        value={formData.synopsis || ""}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <input
        type="url"
        name="cover"
        placeholder="URL da capa"
        value={formData.cover || ""}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full border rounded p-2"
      >
        <option value="QUERO_LER">Quero Ler</option>
        <option value="LENDO">Lendo</option>
        <option value="LIDO">Lido</option>
        <option value="PAUSADO">Pausado</option>
        <option value="ABANDONADO">Abandonado</option>
      </select>

      <input
        type="number"
        name="genreId"
        placeholder="ID do Gênero"
        value={formData.genreId}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        Salvar
      </button>
    </form>
  );
}

