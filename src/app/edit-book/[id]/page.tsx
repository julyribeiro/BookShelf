"use client";
import React, { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { getBooks, updateBooks } from "@/data/books";
import { Book, ReadingStatus } from "@/types/book";
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
import {
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
  params: { id: string } | any; // 👈 tipagem relaxada
}) {
  const numericId = Number(params?.id);
  const router = useRouter();

  const allBooks = getBooks();
  const bookToEdit = allBooks.find((b) => Number(b.id) === numericId);

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

    if (name === "synopsis") setSynopsisCount(value.length);
    if (name === "notes") setNotesCount(value.length);

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
    if (newRating > 0) setNoRating(false);
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
        id: String(numericId),
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
      {/* JSX todo igual ao seu */}
    </div>
  );
}

