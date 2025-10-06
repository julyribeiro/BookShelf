// prisma/seed.ts

// Usa a sintaxe CJS com o caminho relativo, que AGORA FUNCIONARÁ com tsconfig.seed.json.
const prismaModule = require("@/lib/prisma");
const initialBooksModule = require("@/data/books"); 

// Extrai o export correto (solução para o ReferenceError anterior)
const prisma = prismaModule.prisma || prismaModule.default;
const initialBooks = initialBooksModule.initialBooks || initialBooksModule.default;


async function main() {
    const baseGenres = [
        { name: "Literatura Brasileira" },
        { name: "Ficção Científica" },
        { name: "Realismo Mágico" },
        { name: "Fantasia" },
        { name: "Romance" },
        { name: "Biografia" },
        { name: "História" },
        { name: "Autoajuda" },
        { name: "Tecnologia" },
        { name: "Programação" },
        { name: "Negócios" },
        { name: "Psicologia" },
        { name: "Filosofia" },
        { name: "Poesia" },
        { name: "Outro" },
        { name: "Sem gênero" } 
    ];

    console.log("🌱 Iniciando seed: Gêneros e Livros...");

    // 1. CRIA/ATUALIZA A LISTA MESTRA COMPLETA DE GÊNEROS
    for (const genre of baseGenres) {
        await prisma.genre.upsert({
            where: { name: genre.name },
            update: {}, 
            create: genre, 
        });
    }
    console.log("✅ Gêneros base inseridos/atualizados.");

    await prisma.book.deleteMany(); 
    console.log("⚠️ Livros existentes removidos (para evitar duplicação).");


    // 2. CRIA OS LIVROS DE TESTE
    for (const book of initialBooks) {
        await prisma.book.create({
            data: {
                title: book.title,
                author: book.author,
                year: book.year,
                pages: book.pages,
                rating: book.rating,
                synopsis: book.synopsis,
                cover: book.cover,
                status: book.status,
                currentPage: book.currentPage ?? 0,
                isbn: book.isbn,
                notes: book.notes,
                
                genre: {
                    connect: { 
                        name: book.genre ?? "Sem gênero"
                    },
                },
            },
        });
    }

    console.log("✅ Livros iniciais importados com sucesso!");
    console.log("✅ Seed concluído!");
}

main()
    .then(async () => {
        if (prisma) {
            await prisma.$disconnect();
        }
    })
    .catch(async (e) => {
        console.error("❌ Erro ao executar seed:", e);
        if (prisma) {
            await prisma.$disconnect();
        }
        process.exit(1);
    });