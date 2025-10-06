// src/components/FormToast.tsx
"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

export default function FormToast() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    useEffect(() => {
        const status = searchParams.get("status");

        if (status === 'added' || status === 'edited' || status === 'deleted' || status === 'error') {
            let title, description, variant: "default" | "destructive" = "default";

            switch (status) {
                case 'added':
                    title = "Livro adicionado!";
                    description = "O novo livro foi salvo na sua biblioteca com sucesso.";
                    break;
                case 'edited':
                    title = "Livro atualizado!";
                    description = "As alterações foram salvas com sucesso.";
                    break;
                case 'deleted':
                    title = "Livro excluído!";
                    description = "O livro foi removido da sua biblioteca com sucesso.";
                    break;
                case 'error':
                    title = "Operação Falhou!";
                    description = "Houve um erro ao processar sua solicitação no servidor.";
                    variant = "destructive";
                    break;
                default:
                    return;
            }

            toast({
                title: title,
                description: description,
                duration: 5000,
                variant: variant,
            });

            // Limpa o parâmetro de busca para evitar que o toast apareça em recargas futuras
            router.replace("/library", { scroll: false }); 
        }
    }, [searchParams, toast, router]);

    return null; // Este componente não renderiza nada visualmente, apenas gerencia o efeito lateral
}