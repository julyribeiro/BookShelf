// src/app/edit-book/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getBookById, updateBook, Book } from "@/data/books";
import StarRating from "@/components/StarRating";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const formSchema = z.object({
  title: z.string().min(2, { message: "Título deve ter no mínimo 2 caracteres." }),
  author: z.string().min(2, { message: "Autor deve ter no mínimo 2 caracteres." }),
  cover: z.string().url({ message: "URL inválida." }).optional().or(z.literal("")),
  genre: z.string().optional(),
  year: z.string().optional(),
  pages: z.string().regex(/^\d+$/, { message: "Deve ser um número válido." }).optional().or(z.literal("")),
  rating: z.number().optional(),
  synopsis: z.string().optional(),
  status: z.enum(["QUERO_LER", "LENDO", "LIDO", "PAUSADO", "ABANDONADO"]),
});

const genres = [
  "Literatura Brasileira", "Ficção Científica", "Realismo Mágico",
  "Ficção", "Fantasia", "Romance", "Biografia", "História",
  "Autoajuda", "Tecnologia", "Programação", "Negócios",
  "Psicologia", "Filosofia", "Poesia"
];

export default function EditBookPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [book, setBook] = useState<Book | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      cover: "",
      genre: genres[0],
      year: "",
      pages: "",
      rating: 0,
      synopsis: "",
      status: "QUERO_LER",
    },
  });

  useEffect(() => {
    const fetchedBook = getBookById(params.id);
    if (fetchedBook) {
      setBook(fetchedBook);
      form.reset({
        ...fetchedBook,
        year: fetchedBook.year?.toString() || "",
        pages: fetchedBook.pages?.toString() || "",
      });
    }
  }, [params.id]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const updatedBook = {
        ...book!,
        ...values,
        year: values.year ? parseInt(values.year) : undefined,
        pages: values.pages ? parseInt(values.pages) : undefined,
      };
      updateBook(updatedBook);
      toast({
        title: "Livro atualizado!",
        description: "As informações do livro foram salvas com sucesso.",
      });
      router.push("/library");
      setIsSubmitting(false);
    }, 1500);
  };

  if (!book) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="h-10 w-10 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Livro: {book.title}</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input id="title" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="author">Autor</Label>
          <Input id="author" {...form.register("author")} />
          {form.formState.errors.author && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.author.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="cover">URL da Capa (opcional)</Label>
          <Input id="cover" {...form.register("cover")} />
          {form.formState.errors.cover && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.cover.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="genre">Gênero (opcional)</Label>
          <Select onValueChange={(value) => form.setValue("genre", value)} defaultValue={form.getValues("genre")}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um gênero" />
            </SelectTrigger>
            <SelectContent>
              {genres.map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="year">Ano de Publicação (opcional)</Label>
          <Input id="year" type="text" {...form.register("year")} />
        </div>
        <div>
          <Label htmlFor="pages">Total de Páginas (opcional)</Label>
          <Input id="pages" type="text" {...form.register("pages")} />
          {form.formState.errors.pages && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.pages.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="synopsis">Sinopse (opcional)</Label>
          <Textarea id="synopsis" {...form.register("synopsis")} />
        </div>
        <div>
          <Label htmlFor="rating">Avaliação (opcional)</Label>
          <StarRating rating={form.watch("rating") || 0} onRatingChange={(newRating) => form.setValue("rating", newRating)} />
        </div>
        <div>
          <Label htmlFor="status">Status de Leitura</Label>
          <RadioGroup
            defaultValue={form.getValues("status")}
            onValueChange={(value: "QUERO_LER" | "LENDO" | "LIDO" | "PAUSADO" | "ABANDONADO") => form.setValue("status", value)}
            className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="QUERO_LER" id="quero-ler" />
              <Label htmlFor="quero-ler">Quero Ler</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="LENDO" id="lendo" />
              <Label htmlFor="lendo">Lendo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="LIDO" id="lido" />
              <Label htmlFor="lido">Lido</Label>
            </div>
          </RadioGroup>
        </div>
        <Separator />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Alterações"
          )}
        </Button>
      </form>
    </div>
  );
}