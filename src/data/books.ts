import { prisma } from "@/lib/prisma";
import Book from "@/types/book";
import { Book as PrismaBook, Genre } from "@prisma/client";

export type ReadingStatus = 'QUERO_LER' | 'LENDO' | 'LIDO' | 'PAUSADO' | 'ABANDONADO';

type BookWithGenre = PrismaBook & { genre: Genre | null };

export const initialBooks: Book[] = [
    // 1. ROMANCE / CRISTÃO (A Cabana)
    {
        id: '1', 
        title: "A Cabana",
        author: "William P. Young",
        year: 2007,
        cover: "https://m.media-amazon.com/images/I/51ND1ZL6dfL._SY445_SX342_ML2_.jpg", 
        rating: 5,
        status: "LIDO" as ReadingStatus, 
        genre: "Romance", 
        synopsis: "Um pai em luto recebe um convite misterioso para ir a uma cabana no Oregon. Uma jornada sobre fé e perdão.",
        pages: 256,
        isbn: "978-8578600713",
    },
    // 2. PROGRAMAÇÃO (O Código Limpo)
    {
        id: '2', 
        title: "O Código Limpo",
        author: "Robert C. Martin",
        year: 2008,
        cover: "https://m.media-amazon.com/images/I/4138uiy6ghL._UF1000,1000_QL80_.jpg", 
        rating: 5,
        status: "QUERO_LER" as ReadingStatus, 
        genre: "Programação", 
        synopsis: "Guia prático sobre escrita de código de software limpo, elegante e eficiente. Essencial para desenvolvedores.",
        pages: 464,
        isbn: "978-8573166504",
    },
    // 3. PROGRAMAÇÃO: ARQUITETURA (Arquitetura Limpa)
    {
        id: '3', 
        title: "Arquitetura Limpa",
        author: "Robert C. Martin",
        year: 2017,
        cover: "https://images-na.ssl-images-amazon.com/images/I/815d9tE7jSL._AC_UL600_SR600,600_.jpg",
        rating: 5,
        status: "LENDO" as ReadingStatus, 
        genre: "Programação", 
        synopsis: "Estratégias para projetar sistemas de software que sejam robustos, fáceis de testar e fáceis de manter.",
        pages: 432,
        isbn: "978-8550804606",
    },
    // 4. CRISTÃO: VIDA E FÉ (O Peregrino)
    {
        id: '4', 
        title: "O Peregrino",
        author: "John Bunyan",
        year: 1678, 
        cover: "https://m.media-amazon.com/images/I/91TP2-R-JAL._UF1000,1000_QL80_.jpg",
        rating: 4,
        status: "LIDO" as ReadingStatus, 
        genre: "Fantasia", 
        synopsis: "Uma alegoria cristã que narra a jornada do personagem Cristão, da Cidade da Destruição até a Cidade Celestial.",
        pages: 320,
        isbn: "978-8571670984",
    },
    // 5. PROGRAMAÇÃO: PADRÕES (Gang of Four)
    {
        id: '5', 
        title: "Padrões de Projeto",
        author: "Gamma, Helm, Johnson, Vlissides",
        year: 1994,
        cover: "https://m.media-amazon.com/images/I/51nL96Abi1L._UF1000,1000_QL80_.jpg",
        rating: 4,
        status: "PAUSADO" as ReadingStatus, 
        genre: "Programação", 
        synopsis: "O livro que estabeleceu 23 padrões de design essenciais para desenvolvedores OO.",
        pages: 480,
        isbn: "978-8573088028",
    },
    // 6. CRISTÃO: DEVOÇÃO (Em Seus Passos)
    {
        id: '6', 
        title: "Em Seus Passos Que Faria Jesus?",
        author: "Charles M. Sheldon",
        year: 1897,
        cover: "https://abbapress.com.br/loja/wp-content/uploads/2016/11/Capa-Em-seus-passos-baixa-color.jpg", 
        rating: 4,
        status: "LIDO" as ReadingStatus, 
        genre: "Romance", 
        synopsis: "A história de moradores de uma cidade que decidem adotar a regra de não fazer nada sem antes perguntar: 'O que Jesus faria?'",
        pages: 288,
        isbn: "978-8573510507",
    },
    // 7. PROGRAMAÇÃO: FRONT-END (Não me Faça Pensar)
    {
        id: '7', 
        title: "Não Me Faça Pensar",
        author: "Steve Krug",
        year: 2000,
        cover: "https://m.media-amazon.com/images/I/51i8-f+QMFL._UF1000,1000_QL80_.jpg", 
        rating: 4,
        status: "QUERO_LER" as ReadingStatus, 
        genre: "Tecnologia", 
        synopsis: "Focado em usabilidade, é um guia prático e divertido sobre como criar interfaces eficazes.",
        pages: 200,
        isbn: "978-8575080824",
    },
    // 8. CRISTÃO: TEOLOGIA (Conhecendo a Vontade de Deus)
    {
        id: '8', 
        title: "Conhecendo a Vontade de Deus",
        author: "J. I. Packer",
        year: 1990,
        cover: "https://m.magazineluiza.com.br/a-static/420x420/conhecendo-a-vontade-de-deus-serie-estudos-biblicos-j-i-packer-cultura-crista/100cristao/2011393/a4fc98a1efa1885620ab5acb64f52638.jpeg",
        rating: 5,
        status: "LIDO" as ReadingStatus, 
        genre: "Outro", 
        synopsis: "Uma abordagem teológica sobre como os cristãos devem entender e buscar a vontade de Deus em suas vidas.",
        pages: 128,
        isbn: "978-8580380327",
    }
]; 

// Mapeador centralizado para garantir consistência e inclusão de todos os campos
const mapPrismaToBook = (book: BookWithGenre): Book => ({
    id: String(book.id), 
    title: book.title,
    author: book.author,
    year: book.year || 0,
    cover: book.cover || undefined,
    rating: book.rating || 0,
    status: (book.status || "QUERO_LER") as ReadingStatus, 
    genre: book.genre?.name || 'Sem Gênero', 
    synopsis: book.synopsis || undefined,
    notes: book.notes || undefined,
    pages: book.pages || undefined,
});

/*
// 🛑 COMENTADO PARA EVITAR CHAMADA AO PRISMA QUE FALHA NO BUILD
export async function getBooks(): Promise<Book[]> {
    // ... código de busca do Prisma
}

export async function getBookById(id: string): Promise<Book | undefined> {
    // ... código de busca do Prisma
}

export async function getAllGenres(): Promise<Genre[]> {
    // ... código de busca do Prisma
}
*/

export async function getBooks(): Promise<Book[]> {
    // Versão fallback: Retorna dados mockados para o deploy
    console.warn("Usando dados mockados (initialBooks) para o deploy.");
    return initialBooks;
}

export async function getBookById(id: string): Promise<Book | undefined> {
    // Versão fallback: Busca nos dados mockados
    const foundBook = initialBooks.find(book => book.id === id);
    return foundBook;
}

// 🛑 APAGADO OU COMENTADO: getAllGenres

export const addBook = (book: Book): void => {
    console.warn("addBook stub chamado.");
};

export const updateBooks = (updatedBooks: Book[]): void => {
    console.warn("updateBooks stub chamado.");
};

export const updateBook = (updatedBook: Book): void => {
    console.warn("updateBook stub chamado.");
};

export type { Book };