// prisma/seedData.ts
import { Prisma } from "@prisma/client";

// Gêneros
export const initialGenres: Prisma.GenreCreateManyInput[] = [
  { name: "Literatura Brasileira" },
  { name: "Ficção Científica" },
  { name: "Fantasia" },
  { name: "Biografia" },
  { name: "Tecnologia" },
  { name: "Realismo Mágico" },
  { name: "Autoajuda" },
];

// Livros
export const initialBooks: Prisma.BookCreateManyInput[] = [
  {
    title: "Dom Casmurro",
    author: "Machado de Assis",
    year: 1899,
    pages: 256,
    rating: 4.5,
    synopsis:
      "Bentinho, um homem solitário e ciumento, relembra sua juventude e sua paixão por Capitu.",
    cover: "https://i.ebayimg.com/images/g/pisAAOSweM9koJ1M/s-l1200.jpg",
    status: "LIDO",
    genreId: 1, // Literatura Brasileira
  },
  {
    title: "Duna",
    author: "Frank Herbert",
    year: 1965,
    pages: 688,
    rating: 4.7,
    synopsis: "Num futuro distante, a humanidade depende da especiaria melange.",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRADUMKDRS09WrBDr8NFVm9mNhh-OiN5zK01w&s",
    status: "LIDO",
    genreId: 2, // Ficção Científica
  },
  {
    title: "O Senhor dos Anéis: A Sociedade do Anel",
    author: "J.R.R. Tolkien",
    year: 1954,
    pages: 423,
    rating: 4.9,
    synopsis: "O jovem hobbit Frodo herda um anel maligno e parte em uma jornada épica para destruí-lo.",
    cover: "https://m.media-amazon.com/images/I/71jLBXtWJWL.jpg",
    status: "QUERO_LER",
    genreId: 3, // Fantasia
  },
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    year: 2011,
    pages: 656,
    rating: 4.6,
    synopsis: "A biografia definitiva do cofundador da Apple, baseada em entrevistas com o próprio Jobs.",
    cover: "https://m.media-amazon.com/images/I/71sVQDj0SCL.jpg",
    status: "PAUSADO",
    genreId: 4, // Biografia
  },
  {
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    year: 2008,
    pages: 464,
    rating: 4.4,
    synopsis: "Um guia prático sobre como escrever código limpo e de fácil manutenção.",
    cover: "https://m.media-amazon.com/images/I/41xShlnTZTL._SX379_BO1,204,203,200_.jpg",
    status: "ABANDONADO",
    genreId: 5, // Tecnologia
  },
  {
    title: "O Cortiço",
    author: "Aluísio Azevedo",
    year: 1890,
    pages: 352,
    rating: 4.0,
    synopsis: "Romance naturalista sobre a vida em um cortiço carioca.",
    cover: "https://m.media-amazon.com/images/I/41DLCoO9+yL._SY445_SX342_ML2_.jpg",
    status: "LENDO",
    genreId: 1, // Literatura Brasileira
  },
  {
    title: "Cem Anos de Solidão",
    author: "Gabriel García Márquez",
    year: 1967,
    pages: 419,
    rating: 5,
    synopsis: "A história da família Buendía na mítica cidade de Macondo.",
    cover: "https://www.obrasdarte.com/wp-content/uploads/2021/07/Gabriel_Garcia_Marquez_Cem_anos_de_solidao_capa.jpg",
    status: "LENDO",
    genreId: 6, // Realismo Mágico
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    year: 2018,
    pages: 320,
    rating: 4.8,
    synopsis: "Um guia prático para criar bons hábitos e quebrar os maus.",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1544241760i/43172223.jpg",
    status: "LIDO",
    genreId: 7, // Autoajuda
  },
];
