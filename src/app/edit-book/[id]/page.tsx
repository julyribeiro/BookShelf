'use client';

import { useState, useEffect } from 'react';
import { Book, ReadingStatus } from '@/types/book'; // Ajuste o caminho se necessário
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getBookById, updateBooks } from '@/data/books'; // Helpers para dados globais (veja exemplo abaixo)

const genres = [
  'Literatura Brasileira', 'Ficção Científica', 'Realismo Mágico', 'Ficção', 'Fantasia',
  'Romance', 'Biografia', 'História', 'Autoajuda', 'Tecnologia', 'Programação',
  'Negócios', 'Psicologia', 'Filosofia', 'Poesia'
] as const;

const statuses: ReadingStatus[] = ['QUERO_LER', 'LENDO', 'LIDO', 'PAUSADO', 'ABANDONADO'];

export default function EditBook() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  const [form, setForm] = useState<Partial<Book>>({});
  const [originalBook, setOriginalBook] = useState<Book | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Carregar livro ao montar o componente
  useEffect(() => {
    const book = getBookById(bookId);
    if (book) {
      setOriginalBook(book);
      setForm(book);
      setCoverPreview(book.cover || null);
    } else {
      setNotFound(true);
      toast.error('Livro não encontrado');
      router.push('/library'); // Redireciona se não existir
    }
    setLoading(false);
  }, [bookId, router]);

  // Validação em tempo real para obrigatórios
  useEffect(() => {
    if (!loading && originalBook) {
      const newErrors: { [key: string]: string } = {};
      if (!form.title?.trim()) newErrors.title = 'Título é obrigatório';
      if (!form.author?.trim()) newErrors.author = 'Autor é obrigatório';
      setErrors(newErrors);
    }
  }, [form.title, form.author, loading, originalBook]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Limpar erro
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }

    // Preview capa
    if (name === 'cover' && value) {
      setCoverPreview(value);
    } else if (name === 'cover' && !value) {
      setCoverPreview(null);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.title?.trim()) newErrors.title = 'Título é obrigatório';
    if (!form.author?.trim()) newErrors.author = 'Autor é obrigatório';
    if (form.pages && form.pages < 1) newErrors.pages = 'Total de páginas deve ser positivo';
    if (form.currentPage && form.currentPage > (form.pages || 0)) newErrors.currentPage = 'Página atual não pode exceder o total';
    if (form.rating && (form.rating < 1 || form.rating > 5)) newErrors.rating = 'Avaliação deve ser entre 1 e 5';
    if (form.year && (form.year < 0 || form.year > new Date().getFullYear())) newErrors.year = 'Ano inválido';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setSubmitting(true);
    try {
      const updatedBook: Partial<Book> = {
        title: form.title!,
        author: form.author!,
        genre: form.genre || undefined,
        year: form.year ? Number(form.year) : undefined,
        pages: form.pages ? Number(form.pages) : undefined,
        currentPage: form.currentPage ? Number(form.currentPage) : undefined,
        rating: form.rating ? Number(form.rating) : undefined,
        synopsis: form.synopsis || undefined,
        cover: form.cover || undefined,
        status: form.status || 'QUERO_LER',
        isbn: form.isbn || undefined,
        notes: form.notes || undefined,
      };

      // Simular salvamento assíncrono e atualizar no array global
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateBooks(prev => prev.map(b => b.id === bookId ? { ...b, ...updatedBook } : b));

      toast.success('Livro atualizado com sucesso!');
      router.push('/library'); // Redireciona para biblioteca
    } catch (error) {
      toast.error('Erro ao atualizar livro. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  // Barra de progresso (baseado em campos preenchidos)
  const totalFields = 13;
  const filledFields = Object.values(form).filter(Boolean).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Carregando detalhes do livro...</p>
        </div>
      </div>
    );
  }

  if (notFound || !originalBook) {
    return null; // Já redirecionado pelo useEffect
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Editar Livro: {originalBook.title}</h1>

      {/* Barra de progresso */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Progresso do formulário: {progress}%</label>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campos obrigatórios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              value={form.title || ''}
              onChange={handleChange}
              className={errors.title ? 'border-red-500 focus:border-red-500' : ''}
              required
              aria-invalid={!!errors.title}
              placeholder="Digite o título do livro"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Autor *
            </label>
            <Input
              id="author"
              name="author"
              type="text"
              value={form.author || ''}
              onChange={handleChange}
              className={errors.author ? 'border-red-500 focus:border-red-500' : ''}
              required
              aria-invalid={!!errors.author}
              placeholder="Digite o nome do autor"
            />
            {errors.author && <p className="text-red-600 text-sm mt-1">{errors.author}</p>}
          </div>
        </div>

        {/* Campos opcionais: Gênero e Ano */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
              Gênero
            </label>
            <Select value={form.genre || ''} onValueChange={(value) => setForm({ ...form, genre: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um gênero" />
              </SelectTrigger>
              <SelectContent>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Ano de Publicação
            </label>
            <Input
              id="year"
              name="year"
              type="number"
              value={form.year || ''}
              onChange={handleChange}
              className={errors.year ? 'border-red-500 focus:border-red-500' : ''}
              min="0"
              max={new Date().getFullYear()}
              placeholder="Ex: 2023"
            />
            {errors.year && <p className="text-red-600 text-sm mt-1">{errors.year}</p>}
          </div>
        </div>

        {/* Páginas e ISBN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-1">
              Total de Páginas
            </label>
            <Input
              id="pages"
              name="pages"
              type="number"
              value={form.pages || ''}
              onChange={handleChange}
              className={errors.pages ? 'border-red-500 focus:border-red-500' : ''}
              min="1"
              placeholder="Ex: 300"
            />
            {errors.pages && <p className="text-red-600 text-sm mt-1">{errors.pages}</p>}
          </div>

          <div>
            <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <Input
              id="isbn"
              name="isbn"
              type="text"
              value={form.isbn || ''}
              onChange={handleChange}
              placeholder="Ex: 978-3-16-148410-0"
            />
          </div>
        </div>

        {/* Página Atual e Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="currentPage" className="block text-sm font-medium text-gray-700 mb-1">
              Página Atual
            </label>
            <Input
              id="currentPage"
              name="currentPage"
              type="number"
              value={form.currentPage || ''}
              onChange={handleChange}
              className={errors.currentPage ? 'border-red-500 focus:border-red-500' : ''}
              min="0"
              placeholder="Ex: 150"
            />
            {errors.currentPage && <p className="text-red-600 text-sm mt-1">{errors.currentPage}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status de Leitura
            </label>
            <Select value={form.status || 'QUERO_LER'} onValueChange={(value) => setForm({ ...form, status: value as ReadingStatus })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status.replace('_', ' ').toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Avaliação e Capa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
              Avaliação (1-5 estrelas)
            </label>
            <Input
              id="rating"
              name="rating"
              type="number"
              value={form.rating || ''}
              onChange={handleChange}
              className={errors.rating ? 'border-red-500 focus:border-red-500' : ''}
              min="1"
              max="5"
              step="0.5"
              placeholder="Ex: 4.5"
            />
            {errors.rating && <p className="text-red-600 text-sm mt-1">{errors.rating}</p>}
          </div>

          <div>
            <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">
              URL da Capa
            </label>
            <Input
              id="cover"
              name="cover"
              type="url"
              value={form.cover || ''}
              onChange={handleChange}
              placeholder="https://exemplo.com/capa.jpg"
            />
            {coverPreview && (
              <div className="mt-2">
                <img
                  src={coverPreview}
                  alt="Preview da capa do livro"
                  className="w-24 h-32 object-cover rounded border border-gray-200 shadow-sm"
                  onError={() => setCoverPreview(null)}
                />
                <p className="text-xs text-gray-500 mt-1">Preview da capa (atualiza em tempo real)</p>
              </div>
            )}
          </div>
        </div>

        {/* Sinopse */}
        <div>
          <label htmlFor="synopsis" className="block text-sm font-medium text-gray-700 mb-1">
            Sinopse Detalhada
          </label>
          <Textarea
            id="synopsis"
            name="synopsis"
            value={form.synopsis || ''}
            onChange={handleChange}
            rows={4}
            className="resize-vertical"
            placeholder="Descreva a sinopse ou resumo do livro..."
          />
        </div>

        {/* Notas Pessoais */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notas Pessoais
          </label>
          <Textarea
            id="notes"
            name="notes"
            value={form.notes || ''}
            onChange={handleChange}
            rows={3}
            className="resize-vertical"
            placeholder="Suas observações, citações favoritas ou progresso de leitura..."
          />
        </div>

        {/* Botões de ação */}
        <div className="flex space-x-4 pt-4">
          <Button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {submitting ? (
              <>
                <span className="mr-2">Salvando...</span>
                {/* Pode adicionar um spinner aqui se quiser */}
              </>
            ) : (
              'Atualizar Livro'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/library')}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={submitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}