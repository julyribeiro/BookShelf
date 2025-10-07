import { getBookById } from "@/lib/actions";
import BookForm from "@/components/BookForm";

type EditBookPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    return <div className="p-6 text-center text-red-600">Livro não encontrado.</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Livro</h1>
      {/* ✅ Reutiliza o formulário de criação */}
      <BookForm initialData={book} />
    </div>
  );
}
