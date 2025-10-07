// src/components/DeleteBookButton.tsx
"use client";

import { Trash2 } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom"; // Importações necessárias
import { useRouter } from "next/navigation"; // Para o redirecionamento
import { useEffect, useRef } from "react"; // Para efeitos colaterais (redirecionar, toast)

// Importação corrigida. Se o caminho for '.../app/actions.ts', use '@/app/actions'
// Ajuste o caminho se o seu arquivo de actions estiver em outro local
import { deleteBookAction } from '@/app/actions'; 

// Importações do Shadcn/UI
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
// Se você usa o useToast, descomente a linha abaixo
// import { useToast } from "@/components/ui/use-toast"; 


// 1. Componente Auxiliar para o botão (usa useFormStatus)
function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <AlertDialogAction
            type="submit"
            disabled={pending}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
        >
            {pending ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Excluindo...
                </>
            ) : (
                "Sim, Excluir Livro"
            )}
        </AlertDialogAction>
    );
}

// 2. Componente Principal
interface DeleteBookButtonProps {
    bookId: string;
}

// Definição do estado inicial e do resultado esperado da action
const initialState = {
    success: false,
    error: undefined as string | undefined,
};

export function DeleteBookButton({ bookId }: DeleteBookButtonProps) {
    const router = useRouter();
    // const { toast } = useToast(); // Descomente se usar shadcn toast

    // Cria a Server Action vinculada ao ID e passa o estado inicial
    const handleDeleteBound = deleteBookAction.bind(null, bookId);
    const [state, formAction] = useFormState(handleDeleteBound, initialState);
    
    // Ref para controlar se o dialog está aberto (opcional, para fechar após sucesso)
    const closeRef = useRef<HTMLButtonElement>(null);

    // Efeito colateral para lidar com o sucesso/erro após o formAction
    useEffect(() => {
        if (state.success) {
            // Fecha o AlertDialog após a exclusão
            closeRef.current?.click();
            
            // Revalida o cache e redireciona.
            // O ideal é redirecionar para a página da lista de livros.
            router.refresh(); 
            router.push('/books'); 

            // Se você usar toast, descomente:
            // toast({ title: "Sucesso!", description: "Livro excluído com sucesso." });

        } else if (state.error) {
            // Se você usar toast, descomente:
            // toast({ title: "Erro na Exclusão", description: state.error, variant: "destructive" });
            console.error("Erro na exclusão:", state.error);
        }
    }, [state, router]);


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso removerá permanentemente o livro
                        da sua estante BookShelf.
                        {state.error && (
                            <p className="mt-2 text-sm font-medium text-red-500">
                                Erro ao excluir: {state.error}
                            </p>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                {/* 3. A prop action AGORA usa formAction (retorno void) */}
                <form action={formAction}>
                    <AlertDialogFooter>
                        {/* 4. O AlertDialogCancel agora usa ref para fechar o dialog */}
                        <AlertDialogCancel ref={closeRef}>Cancelar</AlertDialogCancel>
                        
                        {/* 5. Usa o componente auxiliar que monitora o status */}
                        <SubmitButton />
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}