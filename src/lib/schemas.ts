// src/lib/schemas.ts

import { z } from "zod";

// 1. Correção do Zod Enum: 'required_error' deve ser 'message' ou usar .min(1) em um array.
// Para z.enum, o método correto de erro é passar 'message' como a segunda opção
// ou usar .safeParse() e tratar o erro de Zod.

// Usaremos a sintaxe mais simples e correta para z.enum com mensagem de erro.
export const BookStatusSchema = z.enum(["WANT_TO_READ", "READING", "READ"], {
    // A chave correta para o erro de enum (valor inválido) é 'message'
    message: "O status do livro deve ser selecionado.",
});

// Definindo o Zod Schema principal (BookSchema)
export const BookSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, { message: "O título é obrigatório." }),
    author: z.string().min(1, { message: "O autor é obrigatório." }),
    
    // Aplicando a correção na sintaxe
    status: BookStatusSchema,
    
    // Campos Numéricos Opcionais
    // Eles devem ser definidos como 'nullable()' e 'optional()', 
    // e usamos 'coerce.number()' para garantir que o input de formulário seja tratado como número
    // O '.pipe()' é essencial para permitir que o input de string vazia do formulário
    // seja convertido para 'null' (que é aceito pelo nullable()).
    year: z.coerce.number().int().nullable().optional().pipe(
        z.union([z.number().int().positive().nullable(), z.literal(null)])
    ).refine(val => val === null || val >= 0, {
        message: "O ano deve ser um número positivo.",
    }),

    totalPages: z.coerce.number().int().nullable().optional().pipe(
        z.union([z.number().int().positive().nullable(), z.literal(null)])
    ).refine(val => val === null || val > 0, {
        message: "O total de páginas deve ser maior que 0.",
    }),
    
    // Correção dos erros 18048 - Tratando como nullable/optional
    currentPage: z.coerce.number().int().nullable().optional().pipe(
        z.union([z.number().int().nullable(), z.literal(null)])
    ).refine((data) => {
        // Agora, 'data' é garantido como number | null | undefined
        const totalPages = data; // A tipagem de 'data' aqui não é o objeto BookFormValues, mas sim o valor do campo.
        return totalPages === null || totalPages === undefined || totalPages >= 0;
    }, {
        message: "A página atual deve ser um número positivo.",
    }),

    // Campos String Opcionais
    isbn: z.string().nullable().optional().transform(e => e === "" ? null : e),
    coverUrl: z.string().url("URL da capa inválida.").nullable().optional().transform(e => e === "" ? null : e),
    personalNotes: z.string().nullable().optional().transform(e => e === "" ? null : e),
    synopsis: z.string().nullable().optional().transform(e => e === "" ? null : e),

    // Outros Campos Opcionais
    genreId: z.coerce.number().int().nullable().optional().pipe(
        z.union([z.number().int().positive().nullable(), z.literal(null)])
    ).refine(val => val === null || val > 0, {
        message: "O ID do gênero deve ser maior que 0.",
    }),

    rating: z.coerce.number().min(1).max(5).nullable().optional().pipe(
        z.union([z.number().int().min(1).max(5).nullable(), z.literal(null)])
    ),
});

// Adicionando a validação final que causava o erro 18048 (Possivelmente 'undefined')
// Garante que currentPage não seja maior que totalPages
export const FullBookSchema = BookSchema.superRefine((data, ctx) => {
    // Garantir que os campos sejam number ou null para comparação
    const totalPages = data.totalPages ?? null;
    const currentPage = data.currentPage ?? null;

    if (currentPage !== null && totalPages !== null && currentPage > totalPages) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A página atual não pode ser maior que o total de páginas.",
            path: ["currentPage"],
        });
        // IMPORTANTE: NÃO HÁ RETORNO (return) AQUI, a validação falha
        // apenas se um problema for adicionado (ctx.addIssue).
    }
});


export type BookFormValues = z.infer<typeof FullBookSchema>;