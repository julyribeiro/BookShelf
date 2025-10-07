import { notFound } from "next/navigation";
import { getBookById } from "@/lib/actions";
import Image from "next/image";

type BookDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BookDetailsPage({ params }: BookDetailsPageProps) {
  // ✅ aguarda o params
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    return notFound();
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex gap-6">
        <div className="relative w-48 h-72 rounded-lg overflow-hidden shadow-md">
          <Image
            src={book.cover || "/placeholder.jpg"}
            alt={book.title}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-lg text-gray-600 mb-1">Autor: {book.author}</p>
          <p className="text-sm text-gray-500 mb-2">Ano: {book.year}</p>
          <p className="text-gray-700 mb-4">{book.synopsis}</p>
          <p className="text-sm text-gray-500">Páginas: {book.pages}</p>
          <p className="text-sm text-gray-500">Nota: {book.rating}</p>

          {/* ✅ Botão para editar */}
          <a
            href={`/book/edit/${book.id}`}
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Editar Livro
          </a>
        </div>
      </div>
    </div>
  );
}

// ✅ Corrigido também o generateMetadata
export async function generateMetadata({ params }: BookDetailsPageProps) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    return { title: "Livro não encontrado" };
  }

  return { title: `${book.title} – Detalhes` };
}
