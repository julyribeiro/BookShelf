import { getBooks, Book } from "@/data/books";
import { FaBook, FaPlus, FaCheck, FaHourglassHalf, FaChartBar } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import StarRating from "@/components/StarRating";

// Componente Server-Side (async)
export default async function DashboardPage() {
    
    // 1. Busca os dados no servidor e espera (resolve a Promise)
    const allBooks: Book[] = await getBooks(); 

    // 2. Cálculos (executados no servidor)
    const totalBooks = allBooks.length;
    const readingBooks = allBooks.filter((book: Book) => book.status === 'LENDO').length;
    const finishedBooks = allBooks.filter((book: Book) => book.status === 'LIDO').length;
    
    const totalPagesRead = allBooks
        .filter((book: Book) => book.status === 'LIDO' && book.pages)
        .reduce((sum: number, book: Book) => sum + (book.pages || 0), 0);

    const ratedBooks = allBooks.filter((book: Book) => book.rating && book.rating > 0);
    const averageRating = ratedBooks.length === 0
        ? 0
        : ratedBooks.reduce((sum: number, book: Book) => sum + (book.rating || 0), 0) / ratedBooks.length;

    const recentBooks = allBooks
        // Ordena por ID decrescente para pegar os mais recentes
        .sort((a, b) => b.id.localeCompare(a.id))
        .slice(0, 5);
        
    // 3. Renderização
    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-foreground mb-2">
                    Sua Biblioteca Pessoal
                </h1>
                <p className="text-lg text-muted-foreground">
                    Acompanhe seu progresso de leitura, organize seus livros e descubra novas histórias
                </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-center gap-4 mb-8">
                <Button asChild size="lg">
                    <Link href="/add-book" className="flex items-center gap-1">
                        <FaPlus /> Adicionar Novo Livro
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/library" className="flex items-center gap-1">
                        <FaBook /> Ver Biblioteca
                    </Link>
                </Button>
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total de Livros */}
                <Link href="/library" className="block">
                    <Card className="flex items-center justify-between p-6 hover:shadow-lg transition-shadow">
                        <div>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total de Livros
                            </CardTitle>
                            <div className="text-3xl font-bold mt-1 text-foreground">{totalBooks}</div>
                        </div>
                        <div className="bg-primary/10 p-3 rounded-full">
                            <FaBook className="h-6 w-6 text-primary" />
                        </div>
                    </Card>
                </Link>

                {/* Lendo Atualmente */}
                <Link href="/library?status=LENDO" className="block">
                    <Card className="flex items-center justify-between p-6 hover:shadow-lg transition-shadow">
                        <div>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Lendo Atualmente
                            </CardTitle>
                            <div className="text-3xl font-bold mt-1 text-foreground">{readingBooks}</div>
                        </div>
                        <div className="bg-orange-200 dark:bg-orange-900/40 p-3 rounded-full">
                            <FaHourglassHalf className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                    </Card>
                </Link>

                {/* Livros Finalizados */}
                <Link href="/library?status=LIDO" className="block">
                    <Card className="flex items-center justify-between p-6 hover:shadow-lg transition-shadow">
                        <div>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Livros Finalizados
                            </CardTitle>
                            <div className="text-3xl font-bold mt-1 text-foreground">{finishedBooks}</div>
                        </div>
                        <div className="bg-green-200 dark:bg-green-900/40 p-3 rounded-full">
                            <FaCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                    </Card>
                </Link>

                {/* Páginas Lidas */}
                <Card className="flex items-center justify-between p-6">
                    <div>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Páginas Lidas
                        </CardTitle>
                        <div className="text-2xl font-bold mt-1 text-foreground">{totalPagesRead}</div>
                    </div>
                    <div className="bg-purple-200 dark:bg-purple-900/40 p-3 rounded-full">
                        <FaChartBar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                </Card>
            </div>

            <Separator className="my-8" />

            {/* Avaliação Média */}
            <Card className="p-6 mb-8">
                <CardTitle className="text-xl font-bold text-foreground mb-2">
                    Avaliação Média
                </CardTitle>
                <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold text-foreground">
                        {averageRating.toFixed(1)}
                    </span>
                    <StarRating rating={averageRating} />
                    <span className="text-sm text-muted-foreground">
                        ({ratedBooks.length} avaliações)
                    </span>
                </div>
            </Card>

            {/* Livros Recentes */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-foreground">Livros Recentes</h2>
                    <Button asChild variant="link" className="px-0">
                        <Link href="/library">Ver Todos</Link>
                    </Button>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                    {recentBooks.map((book) => (
                        <div
                            key={book.id}
                            className="flex-shrink-0 w-[150px] md:w-[200px] hover:shadow-lg transition-shadow rounded-lg overflow-hidden"
                        >
                            <Link href={`/book/${book.id}`}>
                                <div className="relative w-full h-[225px] md:h-[300px] mb-2">
                                    {book.cover ? (
                                        <Image
                                            src={book.cover}
                                            alt={`Capa do livro ${book.title}`}
                                            fill
                                            style={{ objectFit: "cover" }}
                                            className="rounded-md"
                                            sizes="(max-width: 768px) 150px, 200px"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground rounded-md">
                                            Sem Capa
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <h3 className="text-sm font-semibold truncate text-foreground">
                                        {book.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {book.author}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}