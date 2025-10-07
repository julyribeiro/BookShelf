// src/app/edit-book/[id]/page.tsx

import { BookFormValues } from "@/lib/schemas"; 
import { getBookAction } from '@/app/actions'; 
import BookEditFormClient from "./BookEditFormClient"; 
import { getAllCategories } from '@/app/actions'; 
import { BookWithGenre, ReadingStatus } from "@/data/books"; 
import { notFound } from "next/navigation"; 


interface EditBookPageProps {
  params: {
    id: string;
  };
}

// Sua função de busca de dados no servidor (mantida)
async function fetchBookData(id: string): Promise<BookWithGenre | null> {
    try {
        const book = await getBookAction(id);
        return book as BookWithGenre | null;
    } catch (error) {
        console.error("Erro ao buscar livro:", error);
        return null;
    }
}

// Função auxiliar para mapear o status do DB (português) para o Form (inglês)
const mapStatusToForm = (dbStatus: ReadingStatus): BookFormValues['status'] => {
    switch (dbStatus) {
        case "QUERO_LER":
            return "WANT_TO_READ";
        case "LENDO":
            return "READING";
        case "LIDO":
            return "READ";
        default:
            return "WANT_TO_READ";
    }
}


export default async function EditBookPage({ params }: EditBookPageProps) {
    const id = params.id;
    
    // 1. BUSCAR O LIVRO
    const book = await fetchBookData(id); 

    // 2. BUSCAR A LISTA DE CATEGORIAS (NOVO)
    const categories = await getAllCategories();

    if (!book) {
        notFound(); 
    }

    // TIPAGEM: Estamos forçando o tipo BookFormValues, mas o BookEditFormClient espera InitialBookProps, 
    // que tem mais campos e nomes ligeiramente diferentes.
    // Para resolver, vamos mapear para os nomes que a prop initialBook espera E incluir os campos extras.
    const initialBookData = {
        
        // Campos de Dados: (Mapeados para os nomes esperados pelo InitialBookProps/FormClient)
        id: String(book.id), // ID convertido para String (Correção do erro anterior)
        title: book.title,
        author: book.author,
        status: mapStatusToForm(book.status),
        year: book.year ?? null, 
        currentPage: book.currentPage ?? null, 
        isbn: book.isbn ?? null, 
        synopsis: book.synopsis ?? null,
        genreId: book.genreId ?? null,
        rating: book.rating ?? null,
        
        // 🛑 CORREÇÃO DOS NOMES DE PROPRIEDADE:
        // O erro mencionou que faltam 'pages', 'cover' e 'notes' (que você mapeou para 'totalPages', 'coverUrl', 'personalNotes')
        // Vamos usar os nomes que o componente CLIENTE espera:
        pages: book.pages ?? null,      // Mapeia book.pages para 'pages'
        cover: book.cover ?? null,      // Mapeia book.cover para 'cover'
        notes: book.notes ?? null,      // Mapeia book.notes para 'notes'

        // 🛑 CORREÇÃO DOS METADADOS FALTANTES:
        // O erro mencionou que faltam 'createdAt' e mais 2. Assumimos os campos comuns do seu tipo BookWithGenre.
        createdAt: book.createdAt, // Propriedade 'createdAt' incluída
        updatedAt: book.updatedAt, // Assumindo 'updatedAt' como um dos campos faltantes
        genre: book.genre,         // Assumindo que o objeto 'genre' completo é o último campo faltante
    };


    return (
        <main className="min-h-screen bg-gray-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white align-center mb-1">Editar Livro: {book.title}</h1>
                
                {/* 3. PASSAR A PROP 'categories' OBRIGATÓRIA */}
                <BookEditFormClient 
                    initialBook={initialBookData as any} 
                    categories={categories} 
                /> 
            </div>
        </main>
    );
}