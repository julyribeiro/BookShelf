export type ReadingStatus = 'QUERO_LER' | 'LENDO' | 'LIDO' | 'PAUSADO' | 'ABANDONADO';

export default interface Book {
  id: string; // Identificador único do livro
  title: string; // Título do livro (obrigatório)
  author: string; // Autor do livro (obrigatório)
  genre?: string; // Gênero literário (opcional)
  year?: number; // Ano de publicação (opcional)
  pages?: number; // Total de páginas (opcional)
  currentPage?: number; // Página atual da leitura (opcional)
  rating?: number; // Avaliação de 1 a 5 estrelas (opcional)
  synopsis?: string; // Sinopse ou descrição do livro (opcional)
  cover?: string; // URL da capa do livro (opcional)
  status?: ReadingStatus; // Status de leitura (opcional)
  isbn?: string; // ISBN do livro (opcional)
  notes?: string; // Anotações pessoais sobre o livro (opcional)
}