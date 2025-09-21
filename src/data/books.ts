import { Book } from '../types/book';

export const books: Book[] = [
  {
    id: "1",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    genre: "Literatura Brasileira",
    year: 1899,
    pages: 256,
    rating: 4.5,
    synopsis: "Bentinho, um homem solitário e ciumento, relembra sua juventude e sua paixão por Capitu, questionando se ela o traiu com seu melhor amigo. Um dos maiores clássicos da literatura brasileira, cheio de ambiguidades e ironias.",
    cover: "https://m.media-amazon.com/images/I/61Z2bMhGicL.jpg",
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
    cover: "https://m.media-amazon.com/images/I/41MRn6hy8-L._SY445_SX342_ML2_.jpg",
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
    cover: "https://m.media-amazon.com/images/I/41RBd2DvmgL._SY445_SX342_ML2_.jpg",
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
    cover: "https://m.media-amazon.com/images/I/81wbmWlRNEL._SY342_.jpg",
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
  }
];