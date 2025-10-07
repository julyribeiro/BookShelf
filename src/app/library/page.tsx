// src/app/library/page.tsx

import LibraryClientWrapper from "./LibraryClientWrapper"; 
import { ReadingStatus } from "@prisma/client";
import { getBooks, getAllGenres } from "@/data/books"; 

interface LibraryPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const resolvedSearchParams = await searchParams;
  const statusFilter = resolvedSearchParams.status as ReadingStatus | undefined;

  const booksWithGenre = await getBooks();
  const categories = await getAllGenres();

  const genres: string[] = categories.map((c) => c.name);

  return (
    <LibraryClientWrapper
      initialBooks={booksWithGenre}
      genres={genres}
      categories={categories}
      initialStatus={statusFilter ?? ""}
    />
  );
}
