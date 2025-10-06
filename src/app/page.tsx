import prisma from "@/lib/prisma";

export default async function HomePage() {
  let books = [];

  try {
    books = await prisma.book.findMany({
      include: { genre: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.warn("⚠️ Falha ao conectar ao banco. Usando lista vazia.");
    books = [];
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">📚 Minha Estante</h1>

      {books.length === 0 ? (
        <p className="text-muted-foreground">Nenhum livro cadastrado ainda.</p>
      ) : (
        <ul className="grid gap-4">
          {books.map((book) => (
            <li
              key={book.id}
              className="p-4 border rounded-xl shadow-sm bg-card text-card-foreground"
            >
              <h2 className="font-semibold text-lg">{book.title}</h2>
              <p className="text-sm text-muted-foreground">
                {book.author} — {book.genre?.name || "Sem gênero"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
