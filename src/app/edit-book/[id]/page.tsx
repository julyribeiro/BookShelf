"use client";

import React from "react";
import { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { getBooks, updateBooks } from "@/data/books";
import { Book, ReadingStatus } from "@/types/book";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StarRating from "@/components/StarRating";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  FaArrowLeft,
  FaBook,
  FaPencilAlt,
  FaCalendarAlt,
  FaHashtag,
  FaEye,
  FaStickyNote,
  FaStar,
  FaImage,
  FaUser,
  FaTag,
  FaFile,
  FaSortNumericUpAlt,
} from "react-icons/fa";

const genres = [
  "Literatura Brasileira",
  "Ficção Científica",
  "Realismo Mágico",
  "Ficção",
  "Fantasia",
  "Romance",
  "Biografia",
  "História",
  "Autoajuda",
  "Tecnologia",
  "Programação",
  "Negócios",
  "Psicologia",
  "Filosofia",
  "Poesia",
  "Outro",
] as const;

const statuses: ReadingStatus[] = [
  "QUERO_LER",
  "LENDO",
  "LIDO",
  "PAUSADO",
  "ABANDONADO",
];

export default function EditBookPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();

  const allBooks = getBooks();
  const bookToEdit = allBooks.find((b) => b.id === id);

  const [form, setForm] = useState<Partial<Book>>({ ...bookToEdit });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [noRating, setNoRating] = useState<boolean>(!bookToEdit?.rating);

  const [synopsisCount, setSynopsisCount] = useState(form.synopsis?.length || 0);
  const [notesCount, setNotesCount] = useState(form.notes?.length || 0);

  if (!bookToEdit) {
    notFound();
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const newValue =
      name === "year" || name === "pages" || name === "currentPage"
        ? value === ""
          ? undefined
          : Number(value)
        : value;

    if (name === "synopsis") {
      setSynopsisCount(value.length);
    }
    if (name === "notes") {
      setNotesCount(value.length);
    }

    setForm({ ...form, [name]: newValue });

    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCoverPreview(base64String);
        setForm((prevForm) => ({ ...prevForm, cover: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRatingChange = (newRating: number) => {
    setForm((prevForm) => ({ ...prevForm, rating: newRating }));
    if (newRating > 0) {
      setNoRating(false);
    }
  };

  const handleNoRatingChange = (checked: boolean) => {
    setNoRating(checked);
    if (checked) {
      setForm((prevForm) => ({ ...prevForm, rating: undefined }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.title?.trim()) newErrors.title = "Título é obrigatório";
    if (!form.author?.trim()) newErrors.author = "Autor é obrigatório";
    if (form.pages && form.pages < 1)
      newErrors.pages = "Total de páginas deve ser positivo";
    if (form.currentPage && form.currentPage > (form.pages || 0))
      newErrors.currentPage = "Página atual não pode exceder o total";
    if (form.rating && (form.rating < 1 || form.rating > 5))
      newErrors.rating = "Avaliação deve ser entre 1 e 5";
    if (form.year && (form.year < 0 || form.year > new Date().getFullYear()))
      newErrors.year = "Ano inválido";
    return newErrors;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    setLoading(true);
    try {
      const updatedBook: Book = {
        ...bookToEdit,
        ...form,
        title: form.title!,
        author: form.author!,
        rating: noRating ? undefined : form.rating,
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedBooks = allBooks.map((b) =>
        b.id === updatedBook.id ? updatedBook : b
      );

      updateBooks(updatedBooks);

      toast.success("Livro editado com sucesso!");
      router.push(`/book/${updatedBook.id}`);
    } catch (error) {
      toast.error("Erro ao editar livro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (form.cover && form.cover.startsWith("http")) {
      setCoverPreview(form.cover);
    } else if (form.cover && form.cover.startsWith("data:image")) {
      setCoverPreview(form.cover);
    } else {
      setCoverPreview(null);
    }
  }, [form.cover]);

  const totalFields = 13;
  const filledFields = Object.values(form).filter(Boolean).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
        Editar Livro
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Atualize as informações do seu livro.
      </p>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-12 flex flex-col lg:flex-row gap-12">
        <div className="flex-1 lg:pr-12 lg:border-r lg:border-gray-200">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-gray-800">
              <FaBook className="text-blue-500" /> Informações do Livro
            </h2>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="title"
                  className="flex items-center gap-2 text-gray-700 font-medium"
                >
                  <FaBook className="text-gray-500" /> Título *
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title || ""}
                  onChange={handleChange}
                  className={errors.title ? "border-red-500" : ""}
                  required
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="author"
                  className="flex items-center gap-2 text-gray-700 font-medium"
                >
                  <FaUser className="text-gray-500" /> Autor *
                </Label>
                <Input
                  id="author"
                  name="author"
                  type="text"
                  value={form.author || ""}
                  onChange={handleChange}
                  className={errors.author ? "border-red-500" : ""}
                  required
                />
                {errors.author && (
                  <p className="text-red-600 text-sm mt-1">{errors.author}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="genre"
                  className="flex items-center gap-2 text-gray-700 font-medium"
                >
                  <FaTag className="text-gray-500" /> Gênero
                </Label>
                <Select
                  value={form.genre || ""}
                  onValueChange={(value) => setForm({ ...form, genre: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="year"
                  className="flex items-center gap-2 text-gray-700 font-medium"
                >
                  <FaCalendarAlt className="text-gray-500" /> Ano de Publicação
                </Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={form.year ?? ""}
                  onChange={handleChange}
                  className={errors.year ? "border-red-500" : ""}
                  min="0"
                  max={new Date().getFullYear()}
                />
                {errors.year && (
                  <p className="text-red-600 text-sm mt-1">{errors.year}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="pages"
                  className="flex items-center gap-2 text-gray-700 font-medium"
                >
                  <FaFile className="text-gray-500" /> Total de Páginas
                </Label>
                <Input
                  id="pages"
                  name="pages"
                  type="number"
                  value={form.pages ?? ""}
                  onChange={handleChange}
                  className={errors.pages ? "border-red-500" : ""}
                  min="1"
                />
                {errors.pages && (
                  <p className="text-red-600 text-sm mt-1">{errors.pages}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="isbn"
                  className="flex items-center gap-2 text-gray-700 font-medium"
                >
                  <FaHashtag className="text-gray-500" /> ISBN (Identificador
                  numérico do livro)
                </Label>
                <Input
                  id="isbn"
                  name="isbn"
                  type="text"
                  value={form.isbn || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="currentPage"
                  className="flex items-center gap-2 text-gray-700 font-medium"
                >
                  <FaSortNumericUpAlt className="text-gray-500" /> Página Atual
                </Label>
                <Input
                  id="currentPage"
                  name="currentPage"
                  type="number"
                  value={form.currentPage ?? ""}
                  onChange={handleChange}
                  className={errors.currentPage ? "border-red-500" : ""}
                  min="0"
                />
                {errors.currentPage && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.currentPage}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="status"
                  className="flex items-center gap-2 text-gray-700 font-medium"
                >
                  <FaEye className="text-gray-500" /> Status de Leitura
                </Label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm({ ...form, status: value as ReadingStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace("_", " ").toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="rating"
                className="flex items-center gap-2 text-gray-700 font-medium"
              >
                <FaStar className="text-gray-500" /> Avaliação
              </Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <StarRating
                    rating={form.rating ?? 0}
                    onRatingChange={handleRatingChange}
                  />
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Checkbox
                    id="no-rating"
                    checked={noRating}
                    onCheckedChange={(checked) => handleNoRatingChange(checked as boolean)}
                  />
                  <label htmlFor="no-rating" className="cursor-pointer">
                    Sem classificação
                  </label>
                </div>
              </div>
              {errors.rating && (
                <p className="text-red-600 text-sm mt-1">{errors.rating}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="cover"
                className="flex items-center gap-2 text-gray-700 font-medium"
              >
                <FaImage className="text-gray-500" /> Capa do Livro
              </Label>
              <div className="flex flex-col gap-2">
                <Input
                  id="cover-url"
                  name="cover"
                  type="url"
                  value={form.cover && form.cover.startsWith("http") ? form.cover : ""}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/capa.jpg"
                />
                <span className="text-center text-gray-500 text-sm">ou</span>
                <Input
                  id="cover-file"
                  name="cover-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="synopsis"
                  className="flex items-center gap-2 text-gray-700 font-medium"
                >
                  <FaPencilAlt className="text-gray-500" /> Sinopse
                </Label>
                <Textarea
                  id="synopsis"
                  name="synopsis"
                  value={form.synopsis || ""}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Descrição detalhada do livro..."
                  maxLength={1000}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {synopsisCount}/1000
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="notes"
                  className="flex items-center gap-2 text-gray-700 font-medium"
                >
                  <FaStickyNote className="text-gray-500" /> Notas Pessoais
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={form.notes || ""}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Suas observações..."
                  maxLength={1000}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {notesCount}/1000
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:w-96 flex-shrink-0 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Pré-visualização</h2>
          <div className="w-full bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-8 text-center space-y-6 max-h-[700px] overflow-y-auto">
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Preview da capa"
                className="w-full h-96 mx-auto rounded-lg shadow-lg object-cover transform transition-transform duration-300 hover:scale-105"
                onError={() => setCoverPreview(null)}
              />
            )}
            {!coverPreview && (
              <div className="w-full h-96 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500 text-center border-2 border-dashed border-gray-300">
                <FaImage size={48} className="text-gray-400 mb-4" />
                <p className="text-sm px-4">
                  Adicione uma URL ou faça upload da capa
                </p>
              </div>
            )}

            <div className="space-y-2 w-full">
              <h3 className="text-2xl font-bold text-gray-800 w-full break-words">{form.title || " "}</h3>
              <p className="text-sm font-medium text-gray-600 w-full break-words">{form.author || " "}</p>
            </div>

            {form.rating && form.rating > 0 && !noRating ? (
              <div className="flex justify-center">
                <StarRating rating={form.rating} onRatingChange={() => {}} />
              </div>
            ) : (
                <p className="text-sm text-gray-500">Sem classificação</p>
            )}

            <p className="text-sm text-gray-500 font-semibold w-full break-words">
              {form.genre || " "}
            </p>

            <p className="text-sm text-gray-700 text-justify leading-relaxed break-words whitespace-pre-wrap">
              {form.synopsis || " "}
            </p>

            <p className="text-sm text-gray-700 text-justify leading-relaxed break-words whitespace-pre-wrap">
              {form.notes || " "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}