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
// REMOVIDO: import toast from "react-hot-toast";
import { useToast } from "@/components/ui/use-toast"; // ADICIONADO: useToast do Shadcn
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
  FaInfoCircle,
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

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
  params: Promise<{ id: string }>; 
}) {
  const { id } = React.use(params);
  const { toast } = useToast(); // HOOK DO SHADCN UI

  const bookId = id; 
  const router = useRouter();

  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true); 
  const [isSaving, setIsSaving] = useState(false); 

  const [form, setForm] = useState<Partial<Book>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [noRating, setNoRating] = useState<boolean>(false);

  const [synopsisCount, setSynopsisCount] = useState(0);
  const [notesCount, setNotesCount] = useState(0);

  // Lógica de carregamento de dados
  useEffect(() => {
    const allBooks = getBooks(); 
    const foundBook = allBooks.find((b) => b.id === bookId);

    if (foundBook) {
      setBookToEdit(foundBook);
      setForm({ ...foundBook });
      setCoverPreview(foundBook.cover || null);
      setNoRating(!foundBook.rating);
      setSynopsisCount(foundBook.synopsis?.length || 0);
      setNotesCount(foundBook.notes?.length || 0);
    } 
    
    setIsLoadingInitial(false);
  }, [bookId]); 

  // --- Funções de Manipulação (Mantidas iguais) ---

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

  const handleSelectChange = (value: string, name: keyof Book) => {
    setForm({ ...form, [name]: value });
    if (errors[name]) {
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

  // --- Função de Salvamento (Corrigida com Shadcn Toast) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Feedback de erro usando Shadcn Toast
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os erros no formulário antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const allBooks = getBooks(); 
      
      const updatedBook: Book = {
        ...bookToEdit!,
        ...form,
        id: bookId, 
        title: form.title!,
        author: form.author!,
        rating: noRating ? undefined : form.rating,
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedBooks = allBooks.map((b) =>
        b.id === updatedBook.id ? updatedBook : b
      );

      updateBooks(updatedBooks);

      // FEEDBACK DE SUCESSO USANDO SHADCN TOAST
      toast({
        title: "Sucesso!",
        description: "Livro editado com sucesso e alterações salvas.",
      }); 
      
      router.push(`/book/${updatedBook.id}`); 

    } catch (error) {
      // Feedback de erro usando Shadcn Toast
      toast({
        title: "Erro ao Salvar",
        description: "Ocorreu um erro ao editar livro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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

  // --- Renderização Condicional ---

  if (isLoadingInitial) {
      return <div className="max-w-7xl mx-auto px-6 py-20 text-center text-xl text-gray-800 dark:text-gray-200">Carregando informações para edição...</div>;
  }
  
  if (!bookToEdit) {
    notFound();
  }

  // --- JSX do Formulário (Mantido igual) ---

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-gray-100">
        Editar Livro
      </h1>
      <form onSubmit={handleSave} className="flex flex-col lg:flex-row gap-8">
        
        {/* LADO ESQUERDO: INFORMAÇÕES DO LIVRO */}
        <Card className="flex-1 lg:max-w-[65%]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FaInfoCircle className="text-blue-500" /> Informações do Livro
            </CardTitle>
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
                <div 
                    className="h-1 bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{progress}% completos</p>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* TÍTULO E AUTOR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="title" className="flex items-center gap-1">
                  <FaBook className="text-gray-500" /> Título *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title || ""}
                  onChange={handleChange}
                  className={errors.title ? "border-red-500" : ""}
                  disabled={isSaving}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="author" className="flex items-center gap-1">
                  <FaUser className="text-gray-500" /> Autor *
                </Label>
                <Input
                  id="author"
                  name="author"
                  value={form.author || ""}
                  onChange={handleChange}
                  className={errors.author ? "border-red-500" : ""}
                  disabled={isSaving}
                />
                {errors.author && <p className="text-sm text-red-500">{errors.author}</p>}
              </div>
            </div>

            {/* GÊNERO E ANO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="genre" className="flex items-center gap-1">
                  <FaTag className="text-gray-500" /> Gênero
                </Label>
                <Select
                  value={form.genre || ""}
                  onValueChange={(value) => handleSelectChange(value, "genre")}
                  disabled={isSaving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="year" className="flex items-center gap-1">
                  <FaCalendarAlt className="text-gray-500" /> Ano de Publicação
                </Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={form.year || ""}
                  onChange={handleChange}
                  className={errors.year ? "border-red-500" : ""}
                  disabled={isSaving}
                />
                {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
              </div>
            </div>

            {/* PÁGINAS E ISBN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="pages" className="flex items-center gap-1">
                  <FaFile className="text-gray-500" /> Total de Páginas
                </Label>
                <Input
                  id="pages"
                  name="pages"
                  type="number"
                  value={form.pages || ""}
                  onChange={handleChange}
                  className={errors.pages ? "border-red-500" : ""}
                  disabled={isSaving}
                />
                {errors.pages && <p className="text-sm text-red-500">{errors.pages}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="isbn" className="flex items-center gap-1">
                  <FaHashtag className="text-gray-500" /> ISBN (Identificador numérico do livro)
                </Label>
                <Input
                  id="isbn"
                  name="isbn"
                  value={form.isbn || ""}
                  onChange={handleChange}
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* PÁGINA ATUAL E STATUS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="currentPage" className="flex items-center gap-1">
                    <FaSortNumericUpAlt className="text-gray-500" /> Página Atual
                    </Label>
                    <Input
                    id="currentPage"
                    name="currentPage"
                    type="number"
                    value={form.currentPage || ""}
                    onChange={handleChange}
                    className={errors.currentPage ? "border-red-500" : ""}
                    disabled={isSaving}
                    />
                    {errors.currentPage && <p className="text-sm text-red-500">{errors.currentPage}</p>}
                </div>
                <div className="space-y-1">
                    <Label htmlFor="status" className="flex items-center gap-1">
                    <FaEye className="text-gray-500" /> Status de Leitura
                    </Label>
                    <Select
                        value={form.status || statuses[0]}
                        onValueChange={(value) => handleSelectChange(value as ReadingStatus, "status")}
                        disabled={isSaving}
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                        {statuses.map((s) => (
                        <SelectItem key={s} value={s}>
                            {s.replace("_", " ").toUpperCase()}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
            </div>
            
            {/* AVALIAÇÃO */}
            <div className="space-y-1">
              <Label className="flex items-center gap-1 mb-2">
                <FaStar className="text-gray-500" /> Avaliação
              </Label>
              <div className="flex items-center gap-4">
                <StarRating 
                    rating={form.rating || 0} 
                    onRatingChange={handleRatingChange} 
                    disabled={noRating || isSaving}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="no-rating"
                    checked={noRating}
                    onCheckedChange={handleNoRatingChange}
                    disabled={isSaving}
                  />
                  <Label htmlFor="no-rating" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Sem classificação
                  </Label>
                </div>
              </div>
              {errors.rating && <p className="text-sm text-red-500 mt-1">{errors.rating}</p>}
            </div>

            {/* CAPA DO LIVRO */}
            <div className="space-y-1">
                <Label htmlFor="coverUrl" className="flex items-center gap-1">
                <FaImage className="text-gray-500" /> Capa do Livro (URL)
                </Label>
                <Input
                    id="coverUrl"
                    name="cover"
                    value={form.cover && !form.cover.startsWith('data:image') ? form.cover : ''}
                    onChange={handleChange}
                    placeholder="https://exemplo.com/capa.jpg"
                    disabled={isSaving}
                />
                <p className="text-center text-sm text-gray-500 my-2">ou</p>
                <div className="space-y-1">
                    <Label htmlFor="coverFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Escolher arquivo
                    </Label>
                    <Input
                        id="coverFile"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="p-1 cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        disabled={isSaving}
                    />
                </div>
            </div>

            {/* SINOPSE */}
            <div className="space-y-1">
              <Label htmlFor="synopsis" className="flex items-center gap-1">
                <FaPencilAlt className="text-gray-500" /> Sinopse
              </Label>
              <Textarea
                id="synopsis"
                name="synopsis"
                value={form.synopsis || ""}
                onChange={handleChange}
                maxLength={1000}
                rows={4}
                placeholder="Descrição detalhada do livro..."
                disabled={isSaving}
              />
              <p className="text-xs text-right text-gray-500">
                {synopsisCount}/1000
              </p>
            </div>

            {/* NOTAS PESSOAIS */}
            <div className="space-y-1">
              <Label htmlFor="notes" className="flex items-center gap-1">
                <FaStickyNote className="text-gray-500" /> Notas Pessoais
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={form.notes || ""}
                onChange={handleChange}
                maxLength={1000}
                rows={4}
                placeholder="Suas observações..."
                disabled={isSaving}
              />
              <p className="text-xs text-right text-gray-500">
                {notesCount}/1000
              </p>
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Salvando Alterações...' : 'Salvar Edições'}
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* LADO DIREITO: PRÉ-VISUALIZAÇÃO */}
        <Card className="flex-1 lg:max-w-[35%] lg:sticky lg:top-8 self-start">
          <CardHeader>
            <CardTitle className="text-xl">Pré-visualização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md mx-auto max-w-xs">
              {coverPreview ? (
                <Image
                  src={coverPreview}
                  alt="Pré-visualização da Capa"
                  fill
                  style={{ objectFit: "contain" }}
                  priority={false}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 p-4">
                  <FaImage className="w-10 h-10 mb-2" />
                  <p className="text-sm">Adicione uma URL ou faça upload da capa</p>
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold mt-4 dark:text-gray-100 break-words">
              {form.title || "Título do Livro"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 break-words">
              {form.author || "Autor Desconhecido"}
            </p>
            <div className="flex items-center justify-center gap-2">
                <StarRating rating={form.rating || 0} />
                <span className="text-gray-500 dark:text-gray-400">
                    {!form.rating && !noRating ? "Sem classificação" : `(${(form.rating || 0).toFixed(1)})`}
                </span>
            </div>
            
          </CardContent>
        </Card>
      </form>
    </div>
  );
}