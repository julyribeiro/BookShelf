'use client';

import { useState, useEffect } from 'react';
import { Book, ReadingStatus } from '@/types/book';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { updateBooks } from '@/data/books';
import { Label } from '@/components/ui/label';

import StarRating from '@/components/StarRating';
import { FaBook, FaPencilAlt, FaGlobe, FaCalendarAlt, FaHashtag, FaEye, FaStickyNote, FaStar, FaInfoCircle, FaImage, FaUser, FaTag, FaFile, FaSortNumericUpAlt } from 'react-icons/fa';

const genres = [
  'Literatura Brasileira', 'Ficção Científica', 'Realismo Mágico', 'Ficção', 'Fantasia',
  'Romance', 'Biografia', 'História', 'Autoajuda', 'Tecnologia', 'Programação',
  'Negócios', 'Psicologia', 'Filosofia', 'Poesia', 'Outro'
] as const;

const statuses: ReadingStatus[] = ['QUERO_LER', 'LENDO', 'LIDO', 'PAUSADO', 'ABANDONADO'];

export default function AddBook() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Book>>({
    title: '',
    author: '',
    genre: '',
    year: undefined,
    pages: undefined,
    currentPage: undefined,
    rating: undefined,
    synopsis: '',
    cover: '',
    status: undefined,
    isbn: '',
    notes: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [synopsisCount, setSynopsisCount] = useState(0);
  const [notesCount, setNotesCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    const newValue = (name === 'year' || name === 'pages' || name === 'currentPage')
      ? (value === '' ? undefined : Number(value))
      : value;

    if (name === 'synopsis') {
      setSynopsisCount(value.length);
    }
    if (name === 'notes') {
      setNotesCount(value.length);
    }
    
    setForm({ ...form, [name]: newValue });

    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleRatingChange = (newRating: number) => {
    setForm(prevForm => ({ ...prevForm, rating: newRating }));
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

    setLoading(true);
    try {
      const newBook: Book = {
        id: uuidv4(),
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

      await new Promise(resolve => setTimeout(resolve, 1000));
      updateBooks([newBook]); 

      toast.success('Livro adicionado com sucesso!');
      router.push('/library');
    } catch (error) {
      toast.error('Erro ao adicionar livro. Tente novamente.');
    } finally {
      setLoading(false);
      setForm({ title: '', author: '', genre: '', status: 'QUERO_LER' });
    }
  };

  const totalFields = 13;
  const filledFields = Object.values(form).filter(Boolean).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  useEffect(() => {
    if (form.cover && form.cover.startsWith('http')) {
      setCoverPreview(form.cover);
    } else {
      setCoverPreview(null);
    }
  }, [form.cover]);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Adicionar Novo Livro</h1>
      <p className="text-center text-gray-500 mb-6">Preencha as informações do livro para adicioná-lo à sua biblioteca.</p>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-12 flex flex-col lg:flex-row gap-12">
        
        {/* Formulário (lado esquerdo) */}
        <div className="flex-1 lg:pr-12 lg:border-r lg:border-gray-200">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-gray-800">
              <FaInfoCircle className="text-blue-500" /> Informações do Livro
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-right text-sm text-gray-500 mt-1">{progress}% completos</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title" className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaBook className="text-gray-500" /> Título *
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title || ''}
                  onChange={handleChange}
                  className={errors.title ? 'border-red-500' : ''}
                  required
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="author" className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaUser className="text-gray-500" /> Autor *
                </Label>
                <Input
                  id="author"
                  name="author"
                  type="text"
                  value={form.author || ''}
                  onChange={handleChange}
                  className={errors.author ? 'border-red-500' : ''}
                  required
                />
                {errors.author && <p className="text-red-600 text-sm mt-1">{errors.author}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="genre" className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaTag className="text-gray-500" /> Gênero
                </Label>
                <Select value={form.genre || ''} onValueChange={(value) => setForm({ ...form, genre: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="year" className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaCalendarAlt className="text-gray-500" /> Ano de Publicação
                </Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={form.year ?? ''}
                  onChange={handleChange}
                  className={errors.year ? 'border-red-500' : ''}
                  min="0"
                  max={new Date().getFullYear()}
                />
                {errors.year && <p className="text-red-600 text-sm mt-1">{errors.year}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="pages" className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaFile className="text-gray-500" /> Total de Páginas
                </Label>
                <Input
                  id="pages"
                  name="pages"
                  type="number"
                  value={form.pages ?? ''}
                  onChange={handleChange}
                  className={errors.pages ? 'border-red-500' : ''}
                  min="1"
                />
                {errors.pages && <p className="text-red-600 text-sm mt-1">{errors.pages}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="isbn" className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaHashtag className="text-gray-500" /> ISBN (Identificador numérico do livro)
                </Label>
                <Input
                  id="isbn"
                  name="isbn"
                  type="text"
                  value={form.isbn || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="currentPage" className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaSortNumericUpAlt className="text-gray-500" /> Página Atual
                </Label>
                <Input
                  id="currentPage"
                  name="currentPage"
                  type="number"
                  value={form.currentPage ?? ''}
                  onChange={handleChange}
                  className={errors.currentPage ? 'border-red-500' : ''}
                  min="0"
                />
                {errors.currentPage && <p className="text-red-600 text-sm mt-1">{errors.currentPage}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="status" className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaEye className="text-gray-500" /> Status de Leitura
                </Label>
                <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as ReadingStatus })}>
                  <SelectTrigger>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="rating" className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaStar className="text-gray-500" /> Avaliação
                </Label>
                <StarRating rating={form.rating ?? 0} onRatingChange={handleRatingChange} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="cover" className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaImage className="text-gray-500" /> URL da Capa
                </Label>
                <Input
                  id="cover"
                  name="cover"
                  type="url"
                  value={form.cover || ''}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/capa.jpg"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="synopsis" className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaPencilAlt className="text-gray-500" /> Sinopse
                </Label>
                <Textarea
                  id="synopsis"
                  name="synopsis"
                  value={form.synopsis || ''}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Descrição detalhada do livro..."
                  maxLength={1000}
                />
                <div className="text-right text-sm text-gray-500 mt-1">{synopsisCount}/1000</div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="notes" className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaStickyNote className="text-gray-500" /> Notas Pessoais
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={form.notes || ''}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Suas observações..."
                  maxLength={1000}
                />
                <div className="text-right text-sm text-gray-500 mt-1">{notesCount}/1000</div>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? 'Adicionando...' : 'Adicionar Livro'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 text-gray-700 border-gray-300 hover:bg-gray-100">
                Cancelar
              </Button>
            </div>
          </form>
        </div>

        {/* Área de Preview do Livro (lado direito) */}
        <div className="lg:w-96 flex-shrink-0 flex flex-col items-center">
          <div className="w-full bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-8 text-center space-y-6 max-h-[700px] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Pré-visualização</h2>
            
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Preview da capa"
                className="w-full h-96 mx-auto rounded-lg shadow-lg object-cover transform transition-transform duration-300 hover:scale-105"
                onError={() => setCoverPreview(null)}
              />
            )}
            {!coverPreview && (
              <div className="w-full h-96 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500 text-center border-2 border-dashed border-gray-300">
                <FaImage size={48} className="text-gray-400 mb-4" />
                <p className="text-sm px-4">Adicione uma URL da capa para ver a pré-visualização</p>
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-800">{form.title || ' '}</h3>
              <p className="text-sm font-medium text-gray-600">{form.author || ' '}</p>
            </div>
            
            {form.rating && form.rating > 0 && (
              <div className="flex justify-center">
                <StarRating rating={form.rating} onRatingChange={() => {}} />
              </div>
            )}

            <p className="text-sm text-gray-500 font-semibold">{form.genre || ' '}</p>

            <p className="text-sm text-gray-700 text-justify leading-relaxed break-words">
              {form.synopsis || ' '}
            </p>

            <p className="text-sm text-gray-700 text-justify leading-relaxed break-words">
              {form.notes || ' '}
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}