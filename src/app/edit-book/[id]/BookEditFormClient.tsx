'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
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
import {
  FaBook,
  FaPencilAlt,
  FaCalendarAlt,
  FaHashtag,
  FaEye,
  FaStickyNote,
  FaStar,
  FaInfoCircle,
  FaImage,
  FaUser,
  FaTag,
  FaFile,
  FaSortNumericUpAlt,
  FaTrashAlt,
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ReadingStatus, Book, Genre } from "@prisma/client";
import { updateBookAction, deleteBookAction } from '@/actions/bookActions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// interface BookWithGenre é a base de dados completa
type BookWithGenre = Book & {
  genre: Genre | null;
};

interface InitialBookProps {
  id: string | number; // Deve aceitar string (do mapeamento) ou number (do DB)
  title: string;
  author: string;

  // O erro indicou que 'pages', 'cover', 'notes' estão faltando, então usamos eles:
  pages: number | null | undefined;
  cover: string | null | undefined;
  notes: string | null | undefined;

  // Campos de metadados obrigatórios do DB (que faltavam no seu objeto do Page.tsx)
  createdAt: Date;
  updatedAt: Date;

  // Outros campos do DB
  synopsis: string | null;
  year: number | null;
  currentPage: number | null;
  isbn: string | null;
  genreId: number | null;
  rating: number | null;
  status: ReadingStatus;

  // O objeto 'genre' completo é a união de Book & Genre
  genre: Genre | null;
}

interface BookFormClientProps {
  initialBook: InitialBookProps;
  categories: Genre[];
}

// 🛑 BookFormState: Alinhado com InitialBookProps para facilitar a inicialização
interface BookFormState {
  title: string;
  author: string;
  genreId: number | undefined;
  year: number | undefined;
  pages: number | undefined;
  currentPage: number | undefined;
  rating: number | undefined;
  synopsis: string;
  cover: string;
  status: ReadingStatus | null;
  isbn: string;
  notes: string;
}

const statuses: ReadingStatus[] = [
  "QUERO_LER",
  "LENDO",
  "LIDO",
  "PAUSADO",
  "ABANDONADO",
];

// --- CLIENT COMPONENT: Lógica de Estado e Formulário ---
export default function BookEditFormClient({ initialBook, categories }: BookFormClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Inicialização do estado
  const [form, setForm] = useState<BookFormState>({
    title: initialBook.title || "",
    author: initialBook.author || "",
    genreId: initialBook.genreId || undefined,
    year: initialBook.year || undefined,
    pages: initialBook.pages || undefined,
    currentPage: initialBook.currentPage || undefined,
    rating: initialBook.rating || undefined,
    synopsis: initialBook.synopsis || "",
    cover: initialBook.cover || "",
    status: initialBook.status || "QUERO_LER",
    isbn: initialBook.isbn || "",
    notes: initialBook.notes || "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialBook.cover || null);
  const [noRating, setNoRating] = useState(initialBook.rating === null || initialBook.rating === undefined);
  const [synopsisCount, setSynopsisCount] = useState(initialBook.synopsis?.length || 0);
  const [notesCount, setNotesCount] = useState(initialBook.notes?.length || 0);


  useEffect(() => {
    // Garante que o coverPreview é atualizado corretamente ao carregar
    setCoverPreview(initialBook.cover || null);
  }, [initialBook.cover]);

  useEffect(() => {
    // Atualiza o preview da capa quando o form.cover muda
    if (form.cover && (form.cover.startsWith("http") || form.cover.startsWith("data:image"))) {
      setCoverPreview(form.cover);
    } else {
      setCoverPreview(null);
    }
  }, [form.cover]);

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

    setForm({ ...form, [name]: newValue as any }); // 'as any' é usado aqui para lidar com a conversão Number/String/undefined

    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelectChange = (name: keyof BookFormState, value: string) => {
    let newValue: any;

    if (name === "status") {
      newValue = value as ReadingStatus;
    } else if (name === "genreId") {
      newValue = value === "" ? undefined : Number(value); // Garante que "" é undefined/null
    } else {
      newValue = value;
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
    if (errors.rating) {
      setErrors({ ...errors, rating: "" });
    }
  };

  const handleNoRatingChange = (checked: boolean) => {
    setNoRating(checked);
    if (checked) {
      setForm((prevForm) => ({ ...prevForm, rating: undefined }));
    }
  };

  const validate = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    const currentYear = new Date().getFullYear();

    if (!form.title?.trim()) newErrors.title = "Por favor, informe o título do livro.";
    if (!form.author?.trim()) newErrors.author = "Por favor, informe o nome do autor.";
    if (form.status === null) {
      newErrors.status = "Por favor, selecione um status de leitura.";
    }
    if (form.pages !== undefined && form.pages <= 0) {
      newErrors.pages = "O total de páginas deve ser um número positivo (maior que zero).";
    }
    if (form.year !== undefined && (form.year > currentYear || form.year < 1000)) {
      newErrors.year = `Ano inválido. Máximo: ${currentYear}.`;
    }
    if (form.currentPage !== undefined) {
      if (form.currentPage < 0) {
        newErrors.currentPage = "Página atual não pode ser um número negativo.";
      }
      if (form.pages !== undefined && form.pages > 0 && form.currentPage > form.pages) {
        newErrors.currentPage = `A página atual (${form.currentPage}) não pode exceder o total de páginas (${form.pages}).`;
      }
    }
    if (!noRating && form.rating === undefined && form.status === "LIDO") {
      newErrors.rating = "Se o livro está 'LIDO', é recomendado dar uma avaliação (ou marcar 'Sem classificação').";
    }
    if (!form.genreId) {
      newErrors.genreId = "Por favor, selecione um gênero/categoria.";
    }

    return newErrors;
  }, [form, noRating]);


  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // 1. Prepara o objeto de dados, garantindo null para campos vazios
      const updateData = {
        title: form.title,
        author: form.author,
        genreId: form.genreId,
        status: form.status,

        year: form.year && form.year > 0 ? form.year : null,
        pages: form.pages && form.pages > 0 ? form.pages : null,
        rating: noRating ? null : (form.rating || 0),
        currentPage: form.currentPage || 0,
        synopsis: form.synopsis || null,
        cover: form.cover || null,
        isbn: form.isbn || null,
        notes: form.notes || null,
      };

      // --- CONVERSÃO PARA FormData ---
      const formData = new FormData();

      // Adiciona o ID do livro ao FormData
      formData.append('id', String(initialBook.id));

      // Adiciona todos os campos de updateData ao FormData
      Object.entries(updateData).forEach(([key, value]) => {
        // Converte para string. Null é convertido para '', que a Server Action deve tratar
        const finalValue = value === null || value === undefined ? '' : String(value);
        formData.append(key, finalValue);
      });

      // Chama a Server Action
      await updateBookAction(formData);

      toast({
        title: "Sucesso!",
        description: `Livro "${form.title}" atualizado com sucesso.`,
      });
      router.push("/library");

    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
      toast({
        title: "Erro ao Salvar",
        description: "Ocorreu um erro ao tentar salvar as alterações no livro.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Novo handler para exclusão
  const handleDeleteBook = async () => {
    setIsDeleting(true);
    try {
      await deleteBookAction(initialBook.id.toString());
      toast({
        title: "Sucesso!",
        description: `Livro "${initialBook.title}" excluído com sucesso.`,
        variant: "default",
      });
      router.push("/library");
    } catch (error) {
      console.error("Erro ao excluir livro:", error);
      toast({
        title: "Erro ao Excluir",
        description: "Não foi possível excluir o livro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Lógica de cálculo de progresso
  const totalFields = 12; // Retirado o ID, pois não é um campo preenchível
  let currentFields = 0;

  // 1. Title
  if (form.title?.trim()) currentFields++;
  // 2. Author
  if (form.author?.trim()) currentFields++;
  // 3. Genre
  if (form.genreId !== undefined && form.genreId > 0) currentFields++; // Adicionado > 0
  // 4. Status
  if (form.status !== null && form.status.trim()) currentFields++;
  // 5. Rating (condicional)
  if (!noRating && (form.rating !== undefined && form.rating > 0)) currentFields++;
  // 6. Cover
  if (form.cover?.trim()) currentFields++;
  // 7. Year
  if (form.year !== undefined && form.year > 0) currentFields++;
  // 8. Pages
  if (form.pages !== undefined && form.pages > 0) currentFields++;
  // 9. CurrentPage
  if (form.currentPage !== undefined && form.currentPage >= 0) currentFields++;
  // 10. ISBN
  if (form.isbn?.trim()) currentFields++;
  // 11. Synopsis
  if (form.synopsis?.trim()) currentFields++;
  // 12. Notes
  if (form.notes?.trim()) currentFields++;


  const progress = Math.min(100, Math.round((currentFields / totalFields) * 100));


  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <form onSubmit={handleSaveBook} className="flex flex-col lg:flex-row gap-8">

        <Card className="flex-1 lg:max-w-[65%]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FaInfoCircle className="text-blue-500" /> Detalhes do Livro
            </CardTitle>
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
              <div
                className="h-1 bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{progress}% das informações básicas preenchidas.</p>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* TÍTULO, AUTOR, GÊNERO, ANO, STATUS, ISBN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Título */}
              <div className="space-y-1">
                <Label htmlFor="title" className="flex items-center gap-1 text-sm font-medium">
                  <FaBook className="text-gray-500" /> Título <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title || ""}
                  onChange={handleChange}
                  className={errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
                  disabled={isSaving || isDeleting}
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              {/* Autor */}
              <div className="space-y-1">
                <Label htmlFor="author" className="flex items-center gap-1 text-sm font-medium">
                  <FaUser className="text-gray-500" /> Autor <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="author"
                  name="author"
                  type="text"
                  value={form.author || ""}
                  onChange={handleChange}
                  className={errors.author ? "border-red-500 focus-visible:ring-red-500" : ""}
                  disabled={isSaving || isDeleting}
                />
                {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author}</p>}
              </div>

              {/* Ano */}
              <div className="space-y-1">
                <Label htmlFor="year" className="flex items-center gap-1 text-sm font-medium">
                  <FaCalendarAlt className="text-gray-500" /> Ano
                </Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={form.year ?? ""}
                  onChange={handleChange}
                  className={errors.year ? "border-red-500 focus-visible:ring-red-500" : ""}
                  disabled={isSaving || isDeleting}
                  min="1000"
                  max={new Date().getFullYear()}
                />
                {errors.year && <p className="text-xs text-red-500 mt-1">{errors.year}</p>}
              </div>
            </div>

            {/* GÊNERO, STATUS, ISBN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Gênero */}
              <div className="space-y-1">
                <Label htmlFor="genreId" className="flex items-center gap-1 text-sm font-medium">
                  <FaTag className="text-gray-500" /> Gênero <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={String(form.genreId || "")}
                  onValueChange={(value) => handleSelectChange("genreId", value)}
                  disabled={isSaving || isDeleting}
                >
                  <SelectTrigger className={errors.genreId ? "border-red-500 focus-visible:ring-red-500" : ""}>
                    <SelectValue placeholder="Selecione um gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    {(categories || []).map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.genreId && <p className="text-xs text-red-500 mt-1">{errors.genreId}</p>}
              </div>

              {/* Status */}
              <div className="space-y-1">
                <Label htmlFor="status" className="flex items-center gap-1 text-sm font-medium">
                  <FaEye className="text-gray-500" /> Status de Leitura <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.status || ""}
                  onValueChange={(value) => handleSelectChange("status", value)}
                  disabled={isSaving || isDeleting}
                >
                  <SelectTrigger className={errors.status ? "border-red-500 focus-visible:ring-red-500" : ""}>
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
                {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status}</p>}
              </div>

              {/* ISBN */}
              <div className="space-y-1">
                <Label htmlFor="isbn" className="flex items-center gap-1 text-sm font-medium">
                  <FaHashtag className="text-gray-500" /> ISBN
                </Label>
                <Input
                  id="isbn"
                  name="isbn"
                  type="text"
                  value={form.isbn || ""}
                  onChange={handleChange}
                  disabled={isSaving || isDeleting}
                />
              </div>
            </div>

            {/* Subtítulo para Progresso e Avaliação */}
            <CardTitle className="flex items-center gap-2 text-xl pt-4">
              <FaSortNumericUpAlt className="text-blue-500" /> Progresso e Avaliação
            </CardTitle>

            {/* PÁGINAS, PÁGINA ATUAL E AVALIAÇÃO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total de Páginas */}
              <div className="space-y-1">
                <Label htmlFor="pages" className="flex items-center gap-1 text-sm font-medium">
                  <FaFile className="text-gray-500" /> Total de Páginas
                </Label>
                <Input
                  id="pages"
                  name="pages"
                  type="number"
                  value={form.pages ?? ""}
                  onChange={handleChange}
                  className={errors.pages ? "border-red-500 focus-visible:ring-red-500" : ""}
                  disabled={isSaving || isDeleting}
                  min="1"
                />
                {errors.pages && <p className="text-xs text-red-500 mt-1">{errors.pages}</p>}
              </div>

              {/* Página Atual */}
              <div className="space-y-1">
                <Label htmlFor="currentPage" className="flex items-center gap-1 text-sm font-medium">
                  <FaSortNumericUpAlt className="text-gray-500" /> Página Atual
                </Label>
                <Input
                  id="currentPage"
                  name="currentPage"
                  type="number"
                  value={form.currentPage ?? ""}
                  onChange={handleChange}
                  className={errors.currentPage ? "border-red-500 focus-visible:ring-red-500" : ""}
                  disabled={isSaving || isDeleting}
                  min="0"
                  max={form.pages ?? undefined}
                />
                {errors.currentPage && <p className="text-xs text-red-500 mt-1">{errors.currentPage}</p>}
              </div>

              {/* Avaliação */}
              <div className="space-y-1">
                <Label className="flex items-center gap-1 mb-2 text-sm font-medium">
                  <FaStar className="text-gray-500" /> Avaliação
                </Label>
                <div className="flex items-center gap-4">
                  <StarRating
                    rating={form.rating ?? 0}
                    onRatingChange={handleRatingChange}
                    disabled={noRating || isSaving || isDeleting}
                  />
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Checkbox
                    id="no-rating"
                    checked={noRating}
                    onCheckedChange={(checked) => handleNoRatingChange(checked as boolean)}
                    disabled={isSaving || isDeleting}
                  />
                  <Label htmlFor="no-rating" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Sem classificação
                  </Label>
                </div>
                {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
              </div>
            </div>


            {/* SINOPSE */}
            <div className="space-y-1">
              <Label htmlFor="synopsis" className="flex items-center gap-1 text-sm font-medium">
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
                disabled={isSaving || isDeleting}
              />
              <p className="text-xs text-right text-gray-500">
                {synopsisCount}/1000
              </p>
            </div>

            {/* NOTAS PESSOAIS */}
            <div className="space-y-1">
              <Label htmlFor="notes" className="flex items-center gap-1 text-sm font-medium">
                <FaStickyNote className="text-gray-500" /> Notas Pessoais
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={form.notes || ""}
                onChange={handleChange}
                maxLength={1000}
                rows={4}
                placeholder="Suas observações sobre a leitura..."
                disabled={isSaving || isDeleting}
              />
              <p className="text-xs text-right text-gray-500">
                {notesCount}/1000
              </p>
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div className="flex justify-between gap-4 pt-4">
              {/* Botão de Excluir com AlertDialog */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={isSaving || isDeleting}>
                    <FaTrashAlt className="mr-2 h-4 w-4" /> Excluir Livro
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente o livro
                      <span className="font-semibold"> "{initialBook.title}"</span>
                      da sua biblioteca e removerá todos os dados relacionados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteBook}
                      disabled={isDeleting}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {isDeleting ? 'Excluindo...' : 'Sim, excluir livro'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>


              <Button type="submit" disabled={isSaving || isDeleting}>
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando Alterações...
                  </>
                ) : 'Salvar Alterações'}
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* Card de Pré-visualização (Fixo/Sticky na lateral) */}
        <Card className="flex-1 lg:max-w-[35%] lg:sticky lg:top-8 self-start">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FaImage className="text-gray-500" /> Pré-visualização da Capa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Capa URL/Upload */}
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="coverUrl" className="flex items-center gap-1 text-sm font-medium">
                  Capa do Livro (URL ou Base64)
                </Label>
                <Input
                  id="coverUrl"
                  name="cover"
                  type="text"
                  value={form.cover || ""}
                  onChange={handleChange}
                  disabled={isSaving || isDeleting}
                  placeholder="Cole a URL da imagem aqui"
                />
              </div>
              {/* Input de Arquivo */}
              <div className="space-y-1">
                <Label htmlFor="fileUpload" className="flex items-center gap-1 text-sm font-medium">
                  Ou Fazer Upload
                </Label>
                <Input
                  id="fileUpload"
                  name="fileUpload"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={isSaving || isDeleting}
                />
              </div>
            </div>

            {/* Visualização da Capa */}
            <div className="mt-4 flex justify-center">
              {coverPreview ? (
                <Image
                  src={coverPreview}
                  alt={`Capa de ${form.title || 'Livro'}`}
                  width={200}
                  height={300}
                  className="w-auto max-h-[300px] object-cover rounded-lg shadow-xl"
                />
              ) : (
                <div className="w-[200px] h-[300px] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-400">
                  Sem Pré-visualização
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </form>
    </div>
  );
}