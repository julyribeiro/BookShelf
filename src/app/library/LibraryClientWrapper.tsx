// src/app/library/LibraryClientWrapper.tsx

"use client";

import { useState, useMemo, useEffect, startTransition } from "react";
import {
  FaPencilAlt,
  FaTrashAlt,
  FaSearch,
  FaEye,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Book, { ReadingStatus } from "@/types/book"
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
import { useSearchParams, useRouter, usePathname } from "next/navigation"; 
import { deleteBookAction } from '@/actions/bookActions'; 
import { Genre } from "@prisma/client"; 

interface LibraryClientWrapperProps {
  initialBooks: Book[];
  initialStatus: string;
  genres: string[];
  categories: Genre[];
}

const statuses = [
  "Todos os Status",
  "LENDO",
  "LIDO",
  "QUERO_LER",
  "PAUSADO",
  "ABANDONADO",
];

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

export default function LibraryClientWrapper({ 
    initialBooks, 
    initialStatus, 
    genres 
}: LibraryClientWrapperProps) {
  const router = useRouter(); 
  const searchParams = useSearchParams();
  const pathname = usePathname(); 

  const [books, setBooks] = useState<Book[]>(initialBooks); 
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos os Gêneros");
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);

  const { toast } = useToast();

  const handleDelete = (bookId: string) => { 
    startTransition(async () => {
      const result = await deleteBookAction(bookId); 

      if (result.success) {
        setBooks(prevBooks => prevBooks.filter(book => String(book.id) !== bookId));

        toast({
          title: "Livro excluído!",
          description: "O livro foi removido da sua biblioteca com sucesso.",
        });
      } else {
        toast({
          title: "Erro ao excluir!",
          description: result.error || "Tente novamente.",
          variant: "destructive",
        });
      }
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

  // Lógica para exibir o toast após adição/edição/exclusão/erro e limpar a URL
  useEffect(() => {
    const status = searchParams.get("status");

    if (status === 'added' || status === 'edited' || status === 'deleted' || status === 'error') {
        let title: string | undefined, description: string | undefined;
        let variant: "default" | "destructive" = "default"; 

        switch (status) {
            case 'added':
                title = "Livro adicionado!";
                description = "O novo livro foi salvo na sua biblioteca com sucesso.";
                break;
            case 'edited':
                title = "Livro atualizado!";
                description = "As alterações foram salvas com sucesso.";
                break;
            case 'deleted':
                title = "Livro excluído!";
                description = "O livro foi removido da sua biblioteca com sucesso.";
                break;
            case 'error': 
                title = "Erro inesperado!";
                description = "Ocorreu um erro ao processar sua requisição. Tente novamente.";
                variant = "destructive";
                break;
            default:
                return;
        }

        toast({
            title: title,
            description: description,
            duration: 5000,
            variant: variant, 
        });

        // Cria nova URLSearchParams e remove o status
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('status');

        // Limpa o parâmetro de busca para evitar que o toast apareça novamente
        router.replace(`${pathname}?${newParams.toString()}`, { scroll: false }); 
    }
  }, [searchParams, toast, router, pathname]);


  return (
    <>
      
      {/* Linha de Busca */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="relative w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por título ou autor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full h-10"
          />
        </div>

        {/* Linha de Filtros (Gênero e Status) */}
        <div className="flex gap-4">
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            {/* Largura ajustada para w-[200px] */}
            <SelectTrigger className="w-full md:w-[200px] h-10">
              <SelectValue placeholder="Todos os Gêneros" />
            </SelectTrigger>
            {/* Adicionada classe z-20 para garantir que o menu fique visível sobre os cards */}
            <SelectContent className="z-20"> 
              {/* Opção estática no topo - Aparecerá UMA VEZ */}
              <SelectItem value="Todos os Gêneros">Todos os Gêneros</SelectItem>
              
              {/* Mapeia a lista de gêneros, GARANTINDO que "Todos os Gêneros" seja filtrado caso esteja nela */}
              {genres.filter(g => g !== "Todos os Gêneros").map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            {/* Largura ajustada para w-[200px] */}
            <SelectTrigger className="w-full md:w-[200px] h-10">
              <SelectValue placeholder="Todos os Status" />
            </SelectTrigger>
            {/* Adicionada classe z-20 para garantir que o menu fique visível sobre os cards */}
            <SelectContent className="z-20"> 
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contagem de Livros */}
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <span>
          {filteredBooks.length} de {initialBooks.length} livros
        </span>
      </div>

      {/* Grid dos Livros: 4 colunas em telas médias e grandes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.length === 0 ? (
          <p className="text-center col-span-full text-muted-foreground text-lg">
            Nenhum livro encontrado com os filtros aplicados.
          </p>
        ) : (
          filteredBooks.map((book: Book) => (
            <div
              key={book.id}
              className="bg-card text-card-foreground rounded-lg shadow-lg border border-border overflow-hidden flex flex-col" 
            >
              {/* Container da Capa e do Overlay com Aspect Ratio Fixo (10:15) */}
              <div className="relative w-full aspect-[10/15] group"> 
                
                {/* Overlay de Ações (Visível no hover) */}
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <div className="flex gap-4">
                    
                    {/* Botão de Visualização (FaEye) */}
                    <Link href={`/book/${book.id}`} passHref>
                      <Button
                        className="p-2 h-10 w-10 rounded-full cursor-pointer bg-blue-500/80 hover:bg-blue-600"
                      >
                        <FaEye className="text-white" />
                      </Button>
                    </Link>

                    {/* Botão de Edição (FaPencilAlt) */}
                    <Link href={`/edit-book/${book.id}`} passHref>
                      <Button
                        className="p-2 h-10 w-10 rounded-full cursor-pointer bg-yellow-500/80 hover:bg-yellow-600"
                      >
                        <FaPencilAlt className="text-white" />
                      </Button>
                    </Link>

                    {/* Botão de Excluir (FaTrashAlt) */}
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
                            onClick={() => handleDelete(String(book.id))} 
                          >
                            Continuar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* Capa do Livro - Usando object-cover para preencher o Aspect Ratio */}
                {book.cover ? (
                  <Image
                    src={book.cover}
                    alt={`Capa do livro ${book.title}`}
                    fill
                    style={{ objectFit: "cover" }} 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-muted-foreground">
                    Sem Capa
                  </div>
                )}
              </div>

              {/* Informações do Livro */}
              <Link href={`/book/${book.id}`} className="block flex-grow">
                <div className="p-3 flex flex-col items-center text-center cursor-pointer h-full">
                  <div className="flex flex-col items-center w-full justify-start flex-grow">
                    <h2 className="text-sm font-semibold text-foreground line-clamp-2 min-h-[2.5rem] hover:text-primary transition-colors mb-0">
                      {book.title}
                    </h2>

                    <p className="text-xs text-muted-foreground mt-0 mb-1 line-clamp-1">
                      {book.author}
                      {book.year && ` (${book.year})`}
                    </p>
                  </div>

                  <div className="flex flex-col items-center w-full flex-shrink-0 mt-2">
                    {/* Avaliação (Estrelas) */}
                    <div className="flex items-center justify-center mb-4">
                      <StarRating rating={book.rating || 0} disabled={true} />
                    </div>

                    {/* Badges de Gênero e Status */}
                    <div className="flex flex-wrap justify-center items-center gap-1">
                      {book.genre && (
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium max-w-full truncate"
                        >
                          {book.genre}
                        </Badge>
                      )}

                      {book.status && (
                        <Badge
                          variant={getStatusBadgeVariant(book.status)}
                          className="text-xs font-medium"
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
    </>
  );
}