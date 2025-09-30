import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
          <div className="text-muted-foreground">
            <p className="text-sm">
              © 2025 BookShelf. Todos os direitos reservados.
            </p>
            <p className="text-xs mt-1">
              Desenvolvido por Celso, Felype, July e Márcia com Next.js e React.
            </p>
          </div>

          <nav
            className="flex space-x-6"
            role="navigation"
            aria-label="Links do rodapé"
          >
            <Link href="/about" aria-label="Sobre o projeto">
              <Button
                variant="link"
                className="text-sm text-primary hover:text-primary/80 p-0 h-auto font-medium transition-colors"
              >
                Sobre
              </Button>
            </Link>
            <Link href="/privacy" aria-label="Política de privacidade">
              <Button
                variant="link"
                className="text-sm text-primary hover:text-primary/80 p-0 h-auto font-medium transition-colors"
              >
                Privacidade
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
