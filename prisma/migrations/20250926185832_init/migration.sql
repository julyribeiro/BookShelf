-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "genre" TEXT,
    "year" INTEGER,
    "pages" INTEGER,
    "rating" REAL,
    "synopsis" TEXT,
    "cover" TEXT,
    "status" TEXT,
    "isbn" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
