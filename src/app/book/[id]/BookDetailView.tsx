'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Book, ReadingStatus } from "@/data/books"; 
import { Badge } from "@/components/ui/badge"; 

interface BookDetailViewProps {
    book: Book;
}

// Função para definir a cor do Badge de Status
const getStatusBadgeClass = (status: ReadingStatus): string => {
    switch (status) {
        case 'LIDO':
            return 'bg-blue-600 hover:bg-blue-700';
        case 'LENDO':
            return 'bg-purple-600 hover:bg-purple-700';
        case 'QUERO_LER':
            return 'bg-green-600 hover:bg-green-700';
        case 'ABANDONADO':
            return 'bg-red-600 hover:bg-red-700';
        case 'PAUSADO':
            return 'bg-gray-600 hover:bg-gray-700';
        default:
            return 'bg-gray-500 hover:bg-gray-600';
    }
};

// Função auxiliar para renderizar estrelas
const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<FaStar key={`empty-${i}`} className="text-gray-300 dark:text-gray-600" />);
    }
    return stars;
};

// Função auxiliar para formatar o status (QUERO_LER -> Quero ler)
const formatStatus = (status: string) => {
    const formatted = status.replace(/_/g, ' ');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
};

export default function BookDetailView({ book }: BookDetailViewProps) {
    const router = useRouter();

    const handleBack = () => {
        router.push("/library");
    };

    const handleEdit = () => {
        router.push(`/book/edit/${book.id}`);
    };
    
    // Stub para a função de exclusão
    const handleDelete = () => {
        console.warn("Função de exclusão chamada. Implementar Server Action aqui.");
    };

    const statusBadgeClass = getStatusBadgeClass(book.status);

    return (
        <div className="max-w-6xl w-full mx-auto py-12 px-6 md:px-10">
            
            {/* BOTÃO VOLTAR */}
            <Button onClick={handleBack} className="mb-8">
                <FaArrowLeft className="mr-2" /> Voltar para a Biblioteca
            </Button>
            
            {/* BLOCO DA CAPA E DETALHES */}
            <div className="flex flex-col md:flex-row items-start gap-8 justify-center">
                
                {/* COLUNA DA CAPA E BOTÕES */}
                <div className="flex-shrink-0 w-full md:w-56">
                    {book.cover && (
                        <img 
                            src={book.cover} 
                            alt={`Capa do livro ${book.title}`} 
                            className="w-full h-auto object-cover rounded shadow-lg mb-4"
                        />
                    )}
                    
                    <div className="flex space-x-2 mt-2">
                        <Button onClick={handleEdit} className="flex-1">
                            <FaEdit className="mr-1" /> Editar
                        </Button>
                        <Button onClick={handleDelete} variant="destructive" className="flex-1">
                            <FaTrash className="mr-1" /> Excluir
                        </Button>
                    </div>
                </div>

                {/* COLUNA DE DETALHES PRINCIPAIS - max-w-lg para limitar a largura do texto */}
                <div className="flex-grow max-w-lg"> 
                    <h1 className="text-4xl font-extrabold mb-1">{book.title}</h1>
                    <h2 className="text-xl text-gray-700 dark:text-gray-300 mb-4">
                        por {book.author}
                    </h2>
                    
                    {/* BADGES E AVALIAÇÃO */}
                    <div className="flex items-center space-x-3 mb-6">
                        {book.genre && (
                            <Badge className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl">
                                {book.genre}
                            </Badge>
                        )}
                        <Badge className={`${getStatusBadgeClass(book.status)} text-white rounded-xl`}>
                            {formatStatus(book.status)}
                        </Badge>
                        <div className="flex items-center text-lg">
                            <div className="flex mr-1">
                                {renderRatingStars(book.rating ?? 0)}
                            </div>
                            <span className="ml-1 text-gray-700 dark:text-gray-300">({(book.rating ?? 0).toFixed(1)})</span>
                        </div>
                    </div>

                    {/* SINOPSE */}
                    {book.synopsis && (
                        <div className="mb-4">
                            <p className="font-bold text-base mb-1">Sinopse</p>
                            <p className="leading-relaxed text-gray-800 dark:text-gray-200 text-justify">
                                {book.synopsis}
                            </p>
                        </div>
                    )}

                    {/* DETALHES: PÁGINAS E ANO DE PUBLICAÇÃO */}
                    <div className="flex gap-8 text-base mt-4">
                        {(book.pages !== undefined && book.pages !== null) && (
                            <p><strong>Páginas:</strong> {book.pages ?? 'N/A'}</p>
                        )}
                        {book.year && (
                            <p><strong>Ano de Publicação:</strong> {book.year}</p>
                        )}
                    </div>
                    
                    {/* NOTAS PESSOAIS */}
                    {book.notes && (
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="font-bold mb-2 text-lg">Notas Pessoais</p>
                            <p className="leading-relaxed whitespace-pre-line text-gray-800 dark:text-gray-200">{book.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}