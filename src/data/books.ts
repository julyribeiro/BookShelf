import Book from "../types/book";
import { v4 as uuidv4 } from "uuid";

export const initialBooks: Book[] = [
  {
    id: "1",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    genre: "Literatura Brasileira",
    year: 1899,
    pages: 256,
    rating: 4.5,
    synopsis: "Bentinho, um homem solitário e ciumento, relembra sua juventude e sua paixão por Capitu, questionando se ela o traiu com seu melhor amigo. Um dos maiores clássicos da literatura brasileira, cheio de ambiguidades e ironias.",
    cover: "https://i.ebayimg.com/images/g/pisAAOSweM9koJ1M/s-l1200.jpg",
    status: "LIDO"
  },
  {
    id: "2",
    title: "Duna",
    author: "Frank Herbert",
    genre: "Ficção Científica",
    year: 1965,
    pages: 688,
    rating: 4.7,
    synopsis: "Num futuro distante, a humanidade depende da especiaria melange, encontrada apenas no planeta desértico Arrakis. Paul Atreides, herdeiro de uma nobre casa, se vê envolvido em uma guerra épica pelo controle do planeta e seu precioso recurso.",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRADUMKDRS09WrBDr8NFVm9mNhh-OiN5zK01w&s",
    status: "LENDO"
  },
  {
    id: "3",
    title: "O Senhor dos Anéis: A Sociedade do Anel",
    author: "J.R.R. Tolkien",
    genre: "Fantasia",
    year: 1954,
    pages: 423,
    rating: 4.9,
    synopsis: "Em uma terra chamada Terra-média, o jovem hobbit Frodo Bolseiro herda um anel mágico e maligno, e embarca em uma jornada épica para destruí-lo no Monte da Perdição, enfrentando orcs, elfos, magos e a própria escuridão.",
    cover: "https://i.ebayimg.com/images/g/Ug8AAOSwpP1nnaYb/s-l1200.jpg",
    status: "QUERO_LER"
  },
  {
    id: "4",
    title: "Steve Jobs",
    author: "Walter Isaacson",
    genre: "Biografia",
    year: 2011,
    pages: 656,
    rating: 4.6,
    synopsis: "Baseada em mais de quarenta entrevistas com Steve Jobs, esta biografia autorizada revela a personalidade intensa e às vezes difícil do gênio que revolucionou seis indústrias: computadores, filmes, música, telefones, tablets e publicações digitais.",
    cover: "https://m.media-amazon.com/images/I/71sVQDj0SCL.jpg",
    status: "PAUSADO"
  },
  {
    id: "5",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    genre: "Tecnologia",
    year: 2008,
    pages: 464,
    rating: 4.4,
    synopsis: "Um guia essencial para todo desenvolvedor que deseja escrever código limpo, legível e sustentável. Robert C. Martin ensina princípios, padrões e práticas que transformam programadores em artesãos do software.",
    cover: "https://m.media-amazon.com/images/I/41xShlnTZTL._SX379_BO1,204,203,200_.jpg",
    status: "ABANDONADO"
  },
  {
    id: "6",
    title: "O Cortiço",
    author: "Aluísio Azevedo",
    genre: "Literatura Brasileira",
    year: 1890,
    pages: 352,
    rating: 4.0,
    synopsis: "Um dos romances mais importantes do Naturalismo no Brasil, 'O Cortiço' retrata a vida de diversos personagens em um cortiço carioca, explorando temas como o determinismo biológico e a influência do ambiente na vida das pessoas.",
    cover: "https://m.media-amazon.com/images/I/41DLCoO9+yL._SY445_SX342_ML2_.jpg",
    status: "LENDO"
  },
  {
    id: "7",
    title: "Cem Anos de Solidão",
    author: "Gabriel García Márquez",
    genre: "Realismo Mágico",
    year: 1967,
    pages: 419,
    rating: 5,
    synopsis: "A história da família Buendía na mítica cidade de Macondo, explorando gerações de amores, guerras e solidão.",
    cover: "https://www.obrasdarte.com/wp-content/uploads/2021/07/Gabriel_Garcia_Marquez_Cem_anos_de_solidao_capa.jpg",
    status: "LENDO"
  },
  {
    id: "8",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Autoajuda",
    year: 2018,
    pages: 320,
    rating: 4.8,
    synopsis: "Um guia prático para criar bons hábitos e quebrar os maus. James Clear oferece estratégias para melhorar um pouco a cada dia.",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1544241760i/43172223.jpg",
    status: "LIDO"
  }
];

const localStorageKey = 'bookshelf-books';

// Tenta carregar os livros do localStorage. Se não houver, usa a lista inicial.
let books: Book[] = [];
if (typeof window !== 'undefined') {
  const storedBooks = localStorage.getItem(localStorageKey);
  books = storedBooks ? JSON.parse(storedBooks) : initialBooks;
} else {
  books = initialBooks;
}

const saveBooksToLocalStorage = (currentBooks: Book[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(localStorageKey, JSON.stringify(currentBooks));
  }
};

export const getBooks = (): Book[] => {
  return books;
};

export const getBookById = (id: string): Book | undefined => {
  return books.find((book) => book.id === id);
};

export const addBook = (book: Book): void => {
  const newBook = { ...book, id: uuidv4() };
  books.push(newBook);
  saveBooksToLocalStorage(books);
};

export const updateBooks = (updatedBooks: Book[]): void => {
  books = updatedBooks;
  saveBooksToLocalStorage(books);
};

export const updateBook = (updatedBook: Book): void => {
  books = books.map((book) =>
    book.id === updatedBook.id ? updatedBook : book
  );
  saveBooksToLocalStorage(books);
};

export type { Book };