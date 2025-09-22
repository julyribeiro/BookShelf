'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { FaSpinner, FaArrowLeft, FaImage, FaInfoCircle } from "react-icons/fa";
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
import { ReadingStatus } from "@/types/book";

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

const statuses: ReadingStatus[] = ['QUERO_LER', 'LENDO', 'LIDO', 'PAUSADO', 'ABANDONADO'];

export default function EditBookPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [book, setBook] = useState<Book | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

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
      if (fetchedBook.cover) {
        setCoverPreview(fetchedBook.cover);
      }
    }
  }, [params.id]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'cover' && value.cover) {
        setCoverPreview(value.cover);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

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
    <div className="max-w-7xl mx-auto px-6">
      <Link href="/library" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-4">
        <FaArrowLeft /> Voltar para a Biblioteca
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Editar Livro</h1>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-12 flex flex-col lg:flex-row gap-12">
        
        {/* Formulário (lado esquerdo) */}
        <div className="flex-1 lg:pr-12 lg:border-r lg:border-gray-200">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-gray-800">
            <FaInfoCircle className="text-blue-500" /> Informações do Livro
          </h2>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Input id="year" type="number" {...form.register("year")} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="pages">Total de Páginas (opcional)</Label>
                <Input id="pages" type="number" {...form.register("pages")} />
                {form.formState.errors.pages && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.pages.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="cover">URL da Capa (opcional)</Label>
                <Input id="cover" {...form.register("cover")} placeholder="https://exemplo.com/capa.jpg" />
                {form.formState.errors.cover && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.cover.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="synopsis">Sinopse (opcional)</Label>
              <Textarea id="synopsis" {...form.register("synopsis")} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="rating">Avaliação (opcional)</Label>
                <StarRating rating={form.watch("rating") || 0} onRatingChange={(newRating) => form.setValue("rating", newRating)} />
              </div>
              <div>
                <Label htmlFor="status">Status de Leitura</Label>
                <Select value={form.watch("status")} onValueChange={(value) => form.setValue("status", value as ReadingStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status.replace('_', ' ').toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

        {/* Área de Preview do Livro (lado direito) */}
        <div className="lg:w-96 flex-shrink-0 flex flex-col items-center">
          <div className="w-full bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-8 text-center space-y-6 max-h-[700px] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Pré-visualização</h2>
            
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Preview da capa"
                className="w-full h-96 mx-auto rounded-lg shadow-lg object-contain transform transition-transform duration-300 hover:scale-105"
                onError={() => setCoverPreview(null)}
              />
            )}
            {!coverPreview && (
              <div className="w-full h-96 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500 text-center border-2 border-dashed border-gray-300">
                <FaImage size={48} className="text-gray-400 mb-4" />
                <p className="text-sm px-4">Adicione uma URL da capa para ver a pré-visualização</p>
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-800">{form.watch("title") || ' '}</h3>
              <p className="text-sm font-medium text-gray-600">{form.watch("author") || ' '}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}