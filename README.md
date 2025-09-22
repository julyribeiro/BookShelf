# 📚 BookShelf  

BookShelf é uma aplicação web moderna para gerenciamento de biblioteca pessoal.  
O usuário pode **cadastrar, listar, editar, excluir e visualizar livros**, além de acompanhar seu progresso de leitura.  

## ✨ Funcionalidades  

- 📊 **Dashboard**: estatísticas gerais da biblioteca  
  - Total de livros cadastrados  
  - Livros em leitura  
  - Livros finalizados  
  - Total de páginas lidas  

- 📖 **Biblioteca (listagem de livros)**  
  - Exibição em cards responsivos  
  - Busca por título ou autor  
  - Filtro por gênero literário  
  - Card com capa (ou fallback), título, autor, ano, estrelas, gênero e ações (visualizar, editar, excluir)  

- ➕ **Adicionar Livro**  
  - Formulário completo  
  - Preview da capa em tempo real  
  - Barra de progresso  
  - Validação de campos  
  - Feedback de sucesso/erro  

- ✏️ **Editar Livro**  
  - Formulário pré-preenchido com dados do livro selecionado  

- 🔎 **Visualizar Livro**  
  - Página de detalhes com todas as informações + sinopse  

- 🗑️ **Excluir Livro**  
  - Diálogo de confirmação  
  - Feedback visual após exclusão  

---

## 🛠️ Tecnologias Utilizadas  

- [Next.js 15 (App Router)](https://nextjs.org/)  
- [React 19](https://react.dev/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [shadcn/ui](https://ui.shadcn.com/)  

---

## 📂 Estrutura de Pastas  

```
📦 bookshelf
 ┣ 📂 app
 ┃ ┣ 📂 add-book
 ┃ ┣ 📂 edit-book/[id]
 ┃ ┣ 📂 book/[id]
 ┃ ┣ 📂 library
 ┃ ┗ 📂 dashboard
 ┣ 📂 components
 ┣ 📂 data
 ┃ ┗ books.ts
 ┣ 📂 types
 ┃ ┗ book.ts
 ┣ 📄 README.md
 ┣ 📄 tailwind.config.ts
 ┗ 📄 package.json
```

---

## 🚀 Como Rodar o Projeto  

1. Clone o repositório:  
   ```bash
   git clone https://github.com/seu-usuario/bookshelf.git
   cd bookshelf
   ```

2. Instale as dependências:  
   ```bash
   npm install
   ```

3. Rode o servidor de desenvolvimento:  
   ```bash
   npm run dev
   ```

4. Acesse no navegador:  
   ```
   http://localhost:3000
   ```

---

## 📊 Dados Iniciais  

O projeto já vem com **5 livros pré-cadastrados** em `data/books.ts`, cobrindo diferentes gêneros, anos de publicação e avaliações.  

---

## 🎨 Design & UX  

- Layout responsivo (mobile-first)  
- Componentes consistentes com **shadcn/ui**  
- Feedback visual para todas as ações (loading, toasts, confirmações)  
- Acessibilidade: labels, navegação por teclado, contraste adequado  

---

## 🤝 Contribuidores  

- 👨‍💻 Celso — Estrutura e Layout Global  
- 👨‍💻 Felype — Dashboard e Estatísticas  
- 👩‍💻 July — Biblioteca (Listagem, Cards, Detalhes e Exclusão)  
- 👩‍💻 Márcia — Formulários (Adicionar e Editar Livro)  

---

## 📌 Observação  

Este projeto foi desenvolvido como parte do curso, seguindo os requisitos propostos no enunciado.  
O foco está em **aprender Next.js, React, TypeScript e Tailwind**, aplicando boas práticas de organização e responsividade.  
