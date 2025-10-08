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
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);

    try {
      if (initialData?.id) {
        await updateBook(initialData.id, formData);
        alert("✅ Livro atualizado com sucesso!");
      } else {
        await createBook(formData);
        alert("✅ Livro criado com sucesso!");
      }

      router.push("/library"); // 🔁 Direciona para biblioteca
    } catch (error) {
      console.error("Erro ao salvar livro:", error);
      alert("❌ Ocorreu um erro ao salvar o livro.");
    } finally {
      setIsSaving(false);
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
      <h1 className="text-2xl font-semibold text-center">
        {initialData?.id ? "Editar Livro" : "Adicionar Livro"}
      </h1>

      {/* ===================== CAMPOS DO FORM ===================== */}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Título
        </label>
        <input
          id="title"
          type="text"
          name="title"
          placeholder="Título"
          value={formData.title}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium mb-1">
          Autor
        </label>
        <input
          id="author"
          type="text"
          name="author"
          placeholder="Autor"
          value={formData.author}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label htmlFor="year" className="block text-sm font-medium mb-1">
          Ano de Publicação
        </label>
        <input
          id="year"
          type="number"
          name="year"
          placeholder="Ano"
          value={formData.year}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label htmlFor="pages" className="block text-sm font-medium mb-1">
          Número de Páginas
        </label>
        <input
          id="pages"
          type="number"
          name="pages"
          placeholder="Páginas"
          value={formData.pages}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium mb-1">
          Avaliação (0–5)
        </label>
        <input
          id="rating"
          type="number"
          step="0.1"
          name="rating"
          placeholder="Avaliação"
          value={formData.rating}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label htmlFor="synopsis" className="block text-sm font-medium mb-1">
          Sinopse
        </label>
        <textarea
          id="synopsis"
          name="synopsis"
          placeholder="Sinopse"
          value={formData.synopsis || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
          rows={4}
        />
      </div>

      <div>
        <label htmlFor="cover" className="block text-sm font-medium mb-1">
          URL da Capa
        </label>
        <input
          id="cover"
          type="url"
          name="cover"
          placeholder="URL da capa"
          value={formData.cover || ""}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">
          Status de Leitura
        </label>
        <select
          id="status"
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
      </div>

      <div>
        <label htmlFor="genreId" className="block text-sm font-medium mb-1">
          ID do Gênero
        </label>
        <input
          id="genreId"
          type="number"
          name="genreId"
          placeholder="ID do Gênero"
          value={formData.genreId}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      {/* ===================== BOTÃO ===================== */}
      <button
        type="submit"
        disabled={isSaving}
        className={`w-full text-white p-2 rounded transition ${
          isSaving
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isSaving ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
