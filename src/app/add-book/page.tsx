"use client";

import { useState, useEffect } from "react";
import Book, { ReadingStatus } from "@/types/book";;
import { v4 as uuidv4 } from "uuid";
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
import { getBooks, updateBooks } from "@/data/books";
import StarRating from "@/components/StarRating";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
} from "react-icons/fa";

type FormReadingStatus = ReadingStatus | null;

interface BookFormState {
  title: string;
  author: string;
  genre: string | undefined;
  year: number | undefined;
  pages: number | undefined;
  currentPage: number | undefined;
  rating: number | undefined;
  synopsis: string;
  cover: string;
  status: FormReadingStatus;
  isbn: string;
  notes: string;
}

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

export default function AddBook() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [form, setForm] = useState<BookFormState>({
    title: "",
    author: "",
    genre: undefined,
    year: undefined,
    pages: undefined,
    currentPage: undefined,
    rating: undefined,
    synopsis: "",
    cover: "",
    status: null,
    isbn: "",
    notes: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [noRating, setNoRating] = useState(false);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [synopsisCount, setSynopsisCount] = useState(0);
  const [notesCount, setNotesCount] = useState(0);

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

  const handleSelectChange = (name: keyof BookFormState, value: string) => {
    const newValue = name === "status" 
        ? (value === "" ? null : (value as FormReadingStatus)) 
        : value;

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

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const currentYear = new Date().getFullYear();

    // Campos Obrigatórios
    if (!form.title?.trim()) newErrors.title = "Por favor, informe o título do livro.";
    if (!form.author?.trim()) newErrors.author = "Por favor, informe o nome do autor.";
    
    // Validação de Status (Checa se é null)
    if (form.status === null) { 
        newErrors.status = "Por favor, selecione um status de leitura.";
    }
    
    // Validação de Números (Pages e Year)
    if (form.pages !== undefined) {
      if (form.pages <= 0) {
        newErrors.pages = "O total de páginas deve ser um número positivo (maior que zero).";
      }
    }
    if (form.year !== undefined) {
      if (form.year > currentYear) {
        newErrors.year = `O ano não pode ser no futuro. Ano máximo permitido: ${currentYear}.`;
      }
      if (form.year < 1000) {
        newErrors.year = "Ano de publicação inválido.";
      }
    }

    // Validação de Progresso de Leitura (CurrentPage)
    if (form.currentPage !== undefined) {
      if (form.currentPage < 0) {
        newErrors.currentPage = "Página atual não pode ser um número negativo.";
      }
      if (form.pages !== undefined && form.pages > 0) {
        if (form.currentPage > form.pages) {
          newErrors.currentPage = `A página atual (${form.currentPage}) não pode exceder o total de páginas (${form.pages}).`;
        }
      } else if (form.currentPage > 0) {
        newErrors.pages = "Se você está preenchendo a Página Atual, o Total de Páginas é recomendado.";
      }
    }

    // Validação de Rating
    if (!noRating && form.rating === undefined && form.status === "LIDO") {
      newErrors.rating = "Se o livro está 'LIDO', é recomendado dar uma avaliação (ou marcar 'Sem classificação').";
    }

    return newErrors;
  };

  // Lógica Final de Salvamento
  const handleSaveBook = async () => {
    setLoading(true);

    let success = false;
    try {
      const newBook: Book = {
        id: uuidv4(),
        title: form.title!,
        author: form.author!,
        genre: form.genre || undefined,
        year: form.year ? Number(form.year) : undefined,
        pages: form.pages ? Number(form.pages) : undefined,
        currentPage: form.currentPage ? Number(form.currentPage) : undefined,
        rating: noRating ? undefined : form.rating,
        synopsis: form.synopsis || undefined,
        cover: form.cover || undefined,
        status: form.status as ReadingStatus, 
        isbn: form.isbn || undefined,
        notes: form.notes || undefined,
      };

      // Simulação de delay de 3s para o usuário ver a mensagem de loading
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const existingBooks = getBooks();
      updateBooks([...existingBooks, newBook]);
      
      success = true;

    } catch (error) {
      toast({
          title: "Erro",
          description: "Erro ao adicionar livro. Tente novamente.",
          variant: "destructive",
      });
    } finally {
      setLoading(false); 
      setIsDialogOpen(false); 
      
      if (success) {
        router.push("/library?status=added");
      }
    }
  };

  // Lógica de Pré-submissão
  const handlePreSubmit = (e: React.FormEvent) => {
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

    setIsDialogOpen(true);
  };

  const totalFields = 13;
  const filledFields = Object.keys(form).filter(key => {
    const value = form[key as keyof typeof form]; 
    
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
      return false;
    }
    
    if (key === 'rating' && (value === undefined || value === 0)) {
        return false;
    }
    return true;
  }).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  useEffect(() => {
    if (form.cover && form.cover.startsWith("http")) {
      setCoverPreview(form.cover);
    } else if (form.cover && form.cover.startsWith("data:image")) {
      setCoverPreview(form.cover);
    } else {
      setCoverPreview(null);
    }
  }, [form.cover]);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h1 className="text-3xl font-bold text-muted-foreground mb-2 text-center">
        Adicionar Novo Livro
      </h1>
      <p className="text-center text-muted-foreground mb-6">
        Preencha as informações do livro para adicioná-lo à sua biblioteca.
      </p>

      <div className="bg-card rounded-xl shadow-lg border border-border p-6 md:p-12 flex flex-col lg:flex-row gap-12">
        {/* Formulário (lado esquerdo) */}
        <div className="flex-1 lg:pr-12 lg:border-r lg:border-border">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-foreground">
              <FaInfoCircle className="text-primary" /> Informações do Livro
            </h2>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-right text-sm text-muted-foreground mt-1">
              {progress}% completos
            </p>
          </div>

          <form onSubmit={handlePreSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="title"
                  className="flex items-center gap-2 text-foreground font-medium"
                >
                  <FaBook className="text-muted-foreground" /> Título <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title || ""}
                  onChange={handleChange}
                  className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-destructive text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="author"
                  className="flex items-center gap-2 text-foreground font-medium"
                >
                  <FaUser className="text-muted-foreground" /> Autor <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="author"
                  name="author"
                  type="text"
                  value={form.author || ""}
                  onChange={handleChange}
                  className={errors.author ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.author && (
                  <p className="text-destructive text-sm mt-1">{errors.author}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="genre"
                  className="flex items-center gap-2 text-foreground font-medium"
                >
                  <FaTag className="text-muted-foreground" /> Gênero
                </Label>
                <Select
                  value={form.genre || ""}
                  onValueChange={(value) => handleSelectChange("genre", value)}
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
                  className="flex items-center gap-2 text-foreground font-medium"
                >
                  <FaCalendarAlt className="text-muted-foreground" /> Ano de Publicação
                </Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={form.year ?? ""}
                  onChange={handleChange}
                  className={errors.year ? "border-destructive focus-visible:ring-destructive" : ""}
                  min="0"
                  max={new Date().getFullYear()}
                />
                {errors.year && (
                  <p className="text-destructive text-sm mt-1">{errors.year}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="pages"
                  className="flex items-center gap-2 text-foreground font-medium"
                >
                  <FaFile className="text-muted-foreground" /> Total de Páginas
                </Label>
                <Input
                  id="pages"
                  name="pages"
                  type="number"
                  value={form.pages ?? ""}
                  onChange={handleChange}
                  className={errors.pages ? "border-destructive focus-visible:ring-destructive" : ""}
                  min="1"
                />
                {errors.pages && (
                  <p className="text-destructive text-sm mt-1">{errors.pages}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="isbn"
                  className="flex items-center gap-2 text-foreground font-medium"
                >
                  <FaHashtag className="text-muted-foreground" /> ISBN (Identificador
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
                  className="flex items-center gap-2 text-foreground font-medium"
                >
                  <FaSortNumericUpAlt className="text-muted-foreground" /> Página Atual
                </Label>
                <Input
                  id="currentPage"
                  name="currentPage"
                  type="number"
                  value={form.currentPage ?? ""}
                  onChange={handleChange}
                  className={errors.currentPage ? "border-destructive focus-visible:ring-destructive" : ""}
                  min="0"
                  max={form.pages ?? undefined}
                />
                {errors.currentPage && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.currentPage}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="status"
                  className="flex items-center gap-2 text-foreground font-medium"
                >
                  <FaEye className="text-muted-foreground" /> Status de Leitura <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.status || ""}
                  onValueChange={(value) =>
                    handleSelectChange("status", value)
                  }
                >
                  <SelectTrigger className={errors.status ? "border-destructive focus-visible:ring-destructive" : ""}>
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
                {errors.status && (
                  <p className="text-destructive text-sm mt-1">{errors.status}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="rating"
                className="flex items-center gap-2 text-foreground font-medium"
              >
                <FaStar className="text-muted-foreground" /> Avaliação
              </Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <StarRating
                    rating={form.rating ?? 0}
                    onRatingChange={handleRatingChange}
                    disabled={noRating}
                  />
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Checkbox
                    id="no-rating"
                    checked={noRating}
                    onCheckedChange={(checked) =>
                      handleNoRatingChange(checked as boolean)
                    }
                  />
                  <label htmlFor="no-rating" className="cursor-pointer">
                    Sem classificação
                  </label>
                </div>
              </div>
              {errors.rating && (
                <p className="text-destructive text-sm mt-1">{errors.rating}</p>
              )}
            </div>

            {/* Campo de URL da capa e Upload */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="cover"
                className="flex items-center gap-2 text-foreground font-medium"
              >
                <FaImage className="text-muted-foreground" /> Capa do Livro
              </Label>
              <div className="flex flex-col gap-2">
                <Input
                  id="cover-url"
                  name="cover"
                  type="url"
                  value={
                    form.cover && form.cover.startsWith("http")
                      ? form.cover
                      : ""
                  }
                  onChange={handleChange}
                  placeholder="https://exemplo.com/capa.jpg"
                />
                <span className="text-center text-muted-foreground text-sm">ou</span>
                <Input
                  id="cover-file"
                  name="cover-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer file:text-foreground dark:file:text-muted-foreground dark:file:bg-card dark:file:border-border dark:file:border-r dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="synopsis"
                  className="flex items-center gap-2 text-foreground font-medium"
                >
                  <FaPencilAlt className="text-muted-foreground" /> Sinopse
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
                <div className="text-right text-sm text-muted-foreground mt-1">
                  {synopsisCount}/1000
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="notes"
                  className="flex items-center gap-2 text-foreground font-medium"
                >
                  <FaStickyNote className="text-muted-foreground" /> Notas Pessoais
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
                <div className="text-right text-sm text-muted-foreground mt-1">
                  {notesCount}/1000
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <Button
                type="submit" 
                disabled={loading}
                className="flex-1 bg-primary hover:bg-priamary/90 text-primary-foreground"
              >
                {/* Lógica para o botão Adicionar Livro (primário) */}
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Salvando Informações...
                    </>
                ) : "Adicionar Livro"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 text-foreground border border-border hover:bg-muted"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>

        {/* Área de Preview do Livro (lado direito) */}
        <div className="lg:w-96 flex-shrink-0 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 dark:text-foreground">Pré-visualização</h2>
          <div className="w-full bg-card rounded-xl border border-border shadow-sm p-8 text-center space-y-6 max-h-[700px] overflow-y-auto">
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Preview da capa"
                className="w-full h-96 mx-auto rounded-lg shadow-lg object-contain transform transition-transform duration-300 hover:scale-105"
                onError={() => setCoverPreview(null)}
              />
            )}
            {!coverPreview && (
              <div className="w-full h-96 bg-card rounded-lg flex flex-col items-center justify-center text-muted-foreground text-center border-2 border-dashed border-gray-300">
                <FaImage size={48} className="text-muted-foreground mb-4" />
                <p className="text-sm px-4">
                  Adicione uma URL ou faça upload da capa
                </p>
              </div>
            )}

            <div className="space-y-2 w-full">
              <h3 className="text-2xl font-bold text-foreground w-full break-words">
                {form.title || " "}
              </h3>
              <p className="text-sm font-medium text-foreground w-full break-words">
                {form.author || " "}
              </p>
            </div>

            {form.rating && form.rating > 0 ? (
              <div className="flex justify-center">
                <StarRating rating={form.rating} disabled={true} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {noRating ? "Sem classificação" : " "}
              </p>
            )}

            <p className="text-sm text-muted-foreground font-semibold w-full break-words">
              {form.genre || " "}
            </p>

            {form.synopsis || form.notes ? (
                <>
                <p className="text-sm text-foreground text-justify leading-relaxed break-words whitespace-pre-wrap">
                    {form.synopsis || " "}
                </p>

                <p className="text-sm text-muted-foreground text-justify leading-relaxed break-words whitespace-pre-wrap border-t pt-4 mt-4 border-border">
                    {form.notes || " "}
                </p>
                </>
            ) : (
                <p> </p>
            )}
          </div>
        </div>
      </div>

      {/* Diálogo de Confirmação */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Adição de Livro</AlertDialogTitle>
                  <AlertDialogDescription>
                      Tem certeza de que deseja salvar o livro "<span className="font-semibold">{form.title || 'Novo Livro'}</span>" na sua biblioteca?
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                      onClick={handleSaveBook} 
                      disabled={loading}
                      className="bg-primary hover:bg-priamary/90 text-primary-foreground"
                  >
                      {/* Lógica para o botão Salvar Livro (dentro do diálogo) */}
                      {loading ? (
                          <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Salvando Informações...
                          </>
                      ) : "Salvar Livro"}
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}