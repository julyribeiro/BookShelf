import Link from 'next/link';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">BookShelf</h1>
        <nav>
          <Link href="/dashboard" className="mr-4 hover:underline">Dashboard</Link>
          <Link href="/library" className="mr-4 hover:underline">Biblioteca</Link>
          <Link href="/add-book" className="hover:underline">Adicionar Livro</Link>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-card text-card-foreground border-t border-border text-center p-4">
        © 2024 BookShelf - Todos os direitos reservados
      </footer>
    </div>
  );
}
