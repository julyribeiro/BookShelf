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
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ReadingStatus, Book, Genre } from "@prisma/client";
import { createBookAction, updateBookAction, deleteBookAction } from '@/actions/bookActions';


// TIPAGENS DO CLIENT COMPONENT
type BookWithGenre = Book & {
    genre: Genre | null;
};

interface InitialBookProps extends Omit<BookWithGenre, 'title' | 'author'> {
    title: string;
    author: string;
}

interface BookFormClientProps {
    initialBook: InitialBookProps;
    categories: Genre[];
}

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

    // Inicialização do estado, agora garantida como string pelo Server Component
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

        setForm({ ...form, [name]: newValue });

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

            router.push("/library?status=edited");

        } catch (error) {
            console.error("Erro ao atualizar livro:", error);
            toast({
                title: "Erro de Conexão",
                description: "Ocorreu um erro inesperado ao conectar com o servidor.",
                variant: "destructive",
            });
            router.push("/library?status=error");
        } finally {
            setIsSaving(false);
        }
    };

    // Lógica de cálculo de progresso
    const totalFields = 13;
    let currentFields = 0;

    // 1. Title
    if (form.title?.trim()) currentFields++;
    // 2. Author
    if (form.author?.trim()) currentFields++;
    // 3. Genre
    if (form.genreId !== undefined) currentFields++;
    // 4. Status
    if (form.status !== null) currentFields++;
    // 5. Rating (condicional)
    if (!noRating && (form.rating !== undefined && form.rating > 0)) currentFields++;
    // 6. Cover
    // Melhoria na lógica: Conta como preenchido se tiver um valor, independente de ser o inicial
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

    // 13. ID
    if (initialBook.id) currentFields++;

    const progress = Math.min(100, Math.round((currentFields / totalFields) * 100));


    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center dark:text-gray-100">
                Editar Livro: {initialBook.title}
            </h1>
            
            <form onSubmit={handleSaveBook} className="flex flex-col lg:flex-row gap-8">

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
                                    <FaBook className="text-gray-500" /> Título <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={form.title || ""}
                                    onChange={handleChange}
                                    className={errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    disabled={isSaving}
                                />
                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="author" className="flex items-center gap-1">
                                    <FaUser className="text-gray-500" /> Autor <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="author"
                                    name="author"
                                    type="text"
                                    value={form.author || ""}
                                    onChange={handleChange}
                                    className={errors.author ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    disabled={isSaving}
                                />
                                {errors.author && <p className="text-sm text-red-500">{errors.author}</p>}
                            </div>
                        </div>

                        {/* GÊNERO E ANO */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="genreId" className="flex items-center gap-1">
                                    <FaTag className="text-gray-500" /> Gênero (Categoria) <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={String(form.genreId || "")}
                                    // CORREÇÃO APLICADA: Usa uma função de callback para passar o valor
                                    onValueChange={(value) => handleSelectChange("genreId", value)}
                                    disabled={isSaving}
                                >
                                    <SelectTrigger className={errors.genreId ? "border-red-500 focus-visible:ring-red-500" : ""}>
                                        <SelectValue placeholder="Selecione um gênero" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={String(category.id)}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.genreId && <p className="text-sm text-red-500">{errors.genreId}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="year" className="flex items-center gap-1">
                                    <FaCalendarAlt className="text-gray-500" /> Ano de Publicação
                                </Label>
                                <Input
                                    id="year"
                                    name="year"
                                    type="number"
                                    value={form.year ?? ""}
                                    onChange={handleChange}
                                    className={errors.year ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    disabled={isSaving}
                                    min="0"
                                    max={new Date().getFullYear()}
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
                                    value={form.pages ?? ""}
                                    onChange={handleChange}
                                    className={errors.pages ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    disabled={isSaving}
                                    min="1"
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
                                    type="text"
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
                                    value={form.currentPage ?? ""}
                                    onChange={handleChange}
                                    className={errors.currentPage ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    disabled={isSaving}
                                    min="0"
                                    max={form.pages ?? undefined}
                                />
                                {errors.currentPage && <p className="text-sm text-red-500">{errors.currentPage}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="status" className="flex items-center gap-1">
                                    <FaEye className="text-gray-500" /> Status de Leitura <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={form.status || ""}
                                    onValueChange={(value) => handleSelectChange("status", value)}
                                    disabled={isSaving}
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
                                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                            </div>
                        </div>

                        {/* AVALIAÇÃO */}
                        <div className="space-y-1">
                            <Label className="flex items-center gap-1 mb-2">
                                <FaStar className="text-gray-500" /> Avaliação
                            </Label>
                            <div className="flex items-center gap-4">
                                <StarRating
                                    rating={form.rating ?? 0}
                                    onRatingChange={handleRatingChange}
                                    disabled={noRating || isSaving}
                                />
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="no-rating"
                                        checked={noRating}
                                        onCheckedChange={(checked) => handleNoRatingChange(checked as boolean)}
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
                                type="url"
                                // Mostra a URL se for uma URL, senão, mostra vazio
                                value={form.cover && form.cover.startsWith('http') ? form.cover : ''}
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
                                {isSaving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Salvando Alterações...
                                    </>
                                ) : 'Salvar Edições'}
                            </Button>
                        </div>

                    </CardContent>
                </Card>

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
                                    sizes="(max-width: 1024px) 100vw, 35vw"
                                    onError={() => setCoverPreview(null)}
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
                            <StarRating rating={form.rating ?? 0} />
                            <span className="text-gray-500 dark:text-gray-400">
                                {noRating ? "Sem classificação" : form.rating ? `(${form.rating.toFixed(1)})` : ''}
                            </span>
                        </div>

                        {form.genreId && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 break-words">
                                {categories.find(c => c.id === form.genreId)?.name || 'Gênero'}
                            </p>
                        )}

                    </CardContent>
                </Card>
            </form>
        </div>
    );
}