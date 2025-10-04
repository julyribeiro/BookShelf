"use client";

import { Suspense } from "react";
import { useState, useMemo, useEffect } from "react";
import { getBooks, updateBooks } from "@/data/books";
import {
  FaPlus,
  FaPencilAlt,
  FaTrashAlt,
  FaSearch,
  FaEye,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Book, ReadingStatus } from "@/types/book";
import StarRating from "@/components/StarRating";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSearchParams } from "next/navigation";

const genres = [
  "Todos os Gêneros",
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
];

const statuses = [
  "Todos os Status",
  "LENDO",
  "LIDO",
  "QUERO_LER",
  "PAUSADO",
  "ABANDONADO",
];

// Função auxiliar para definir a cor do Badge do Status
const getStatusBadgeVariant = (status: ReadingStatus) => {
  switch (status) {
    case "LIDO":
      return "default";
    case "LENDO":
      return "secondary";
    case "QUERO_LER":
      return "outline";
    case "PAUSADO":
      return "secondary";
    case "ABANDONADO":
      return "destructive";
    default:
      return "secondary";
  }
};

// ======== EXPORT PADRÃO ENVOLTO EM SUSPENSE ========
export default function LibraryPage() {
  return (
    <Suspense fallback={<div>Carregando informações da sua biblioteca…</div>}>
      <LibraryPageInner />
    </Suspense>
  );
}

// ======== COMPONENTE PRINCIPAL (usa useSearchParams) ========
function LibraryPageInner() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "Todos os Status";

  const [books, setBooks] = useState<Book[]>(getBooks());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos os Gêneros");
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);

  const { toast } = useToast();

  const handleDelete = (bookId: string) => {
    const updatedBooks = books.filter((book) => book.id !== bookId);
    setBooks(updatedBooks);
    updateBooks(updatedBooks);
    toast({
      title: "Livro excluído!",
      description: "O livro foi removido da sua biblioteca com sucesso.",
    });
  };

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre =
        selectedGenre === "Todos os Gêneros" || book.genre === selectedGenre;
      const matchesStatus =
        selectedStatus === "Todos os Status" || book.status === selectedStatus;
      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [books, searchQuery, selectedGenre, selectedStatus]);

  useEffect(() => {
    const newStatus = searchParams.get("status") || "Todos os Status";
    setSelectedStatus(newStatus);
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-foreground">Minha Biblioteca</h1>
        {/* Adicionar Livro*/}
        <Button asChild>
          <Link href="/add-book" className="flex items-center">
            <FaPlus className="mr-2" />
            <span>Adicionar Livro</span>
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        {/* Input de Busca: Ocupa a linha inteira */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por título ou autor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* FILTROS: Usa GRID para alinhar lado a lado no mobile (grid-cols-2) */}
        <div className="grid grid-cols-2 gap-4 md:flex md:flex-row">
          {/* Select de Gênero */}
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Gênero" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Select de Status */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
        <span>
          {filteredBooks.length} de {books.length} livros
        </span>
      </div>

      {/* Otimização: Grid com cards uniformes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.length === 0 ? (
          <p className="text-center col-span-full text-muted-foreground text-lg">
            Nenhum livro encontrado com os filtros aplicados.
          </p>
        ) : (
          filteredBooks.map((book: Book) => (
            // Card principal usa flex e h-full para altura uniforme
            <div
              key={book.id}
              className="bg-card text-card-foreground rounded-lg shadow-lg border border-border overflow-hidden flex flex-col h-full"
            >
              {/* PARTE SUPERIOR: Capa e Overlay de Ações (Altura: h-80) */}
              <div className="relative w-full h-80 group">
                {/* Overlay de Ações (Aparece no hover) */}
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <div className="flex gap-4">
                    {/* Botão Visualizar (Olho) */}
                    <Button
                      asChild
                      className="p-2 h-10 w-10 rounded-full cursor-pointer bg-blue-500/80 hover:bg-blue-600"
                    >
                      <Link
                        href={`/book/${book.id}`}
                        className="flex items-center justify-center"
                      >
                        <FaEye className="text-white" />
                      </Link>
                    </Button>

                    {/* Botão Editar */}
                    <Button
                      asChild
                      className="p-2 h-10 w-10 rounded-full cursor-pointer bg-yellow-500/80 hover:bg-yellow-600"
                    >
                      <Link
                        href={`/edit-book/${book.id}`}
                        className="flex items-center justify-center"
                      >
                        <FaPencilAlt className="text-white" />
                      </Link>
                    </Button>

                    {/* Botão Excluir (Trigger) */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="p-2 h-10 w-10 rounded-full cursor-pointer bg-red-600/80 hover:bg-red-700"
                        >
                          <FaTrashAlt className="text-white" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso removerá
                            permanentemente o livro &quot;{book.title}&quot;.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(book.id)}
                          >
                            Continuar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* Capa do Livro */}
                {book.cover ? (
                  <Image
                    src={book.cover}
                    alt={`Capa do livro ${book.title}`}
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-muted-foreground">
                    Sem Capa
                  </div>
                )}
              </div>

              {/* PARTE INFERIOR: Informações do Livro (Flex-grow para uniformidade) */}
              <Link href={`/book/${book.id}`} className="block flex-grow">
                {/* Compactação máxima: p-2 no card, flex-col e flex-grow */}
                <div className="p-2 flex flex-col items-center text-center cursor-pointer h-full">
                  {/* Bloco de Título/Autor (Flex-grow: garante que o espaço não usado no título empurra o resto para baixo) */}
                  <div className="flex flex-col items-center w-full flex-grow justify-start">
                    {/* Título (Fonte base, altura mínima para 2 linhas) */}
                    <h2 className="text-base font-semibold text-foreground line-clamp-2 min-h-[2.5rem] hover:text-primary transition-colors mb-0">
                      {book.title}
                    </h2>

                    {/* Autor e Ano (text-xs, mt-0) */}
                    <p className="text-xs text-muted-foreground mt-0 mb-1">
                      {book.author}
                      {book.year && ` (${book.year})`}
                    </p>

                    {/* Espaço reservado para crescimento */}
                    <div className="flex-grow min-h-[0.5rem]" />
                  </div>

                  {/* Bloco Fixo de Estrelas e Badges */}
                  <div className="flex flex-col items-center w-full flex-shrink-0">
                    {/* Estrelas (mt-0, mb-1) */}
                    <div className="flex items-center justify-center mb-4">
                      <StarRating rating={book.rating || 0} disabled={true} />
                    </div>

                    {/* Badges LADO A LADO - Compactos (text-xs e gap-1) */}
                    <div className="flex flex-wrap justify-center items-center gap-1 mt-0">
                      {/* GÊNERO como Badge */}
                      {book.genre && (
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium max-w-full truncate mb-3"
                        >
                          {book.genre}
                        </Badge>
                      )}

                      {/* STATUS de Leitura como Badge */}
                      {book.status && (
                        <Badge
                          variant={getStatusBadgeVariant(book.status)}
                          className="text-xs font-medium mb-3"
                        >
                          {book.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
