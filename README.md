
## Sobre o Projeto

Este repositório contém uma aplicação web leve desenvolvida com **Vite** e **React/TypeScript**. O objetivo principal é fornecer uma interface interativa, organizada a partir de componentes em `src/` e tipagens definidas em `types.ts`.

### Como o Código Funciona

- **Entrada**: `main.tsx` inicializa a aplicação e renderiza o componente `App` dentro de `index.html`.
- **App.tsx**: Componente raiz que coordena a lógica da aplicação, importa estilos de `index.css` e eventualmente gerencia estado global ou contextos.
- **Tipos**: Arquivo `types.ts` define interfaces e tipos TypeScript usados em todo o projeto para garantir segurança de tipos.
- **Estilização**: `index.css` contém estilos globais; componentes individuais podem importar CSS adicionais se necessário.

A aplicação é empacotada e servida pelo Vite durante o desenvolvimento, com suporte a Hot Module Replacement (HMR).

### Arquitetura

A arquitetura segue um padrão típico de SPA (Single Page Application):

1. **Camada de Apresentação** (React) – Componentes em `src/` isolam a interface e a lógica de visualização.
2. **Camada de Tipos/Modelos** – `types.ts` centraliza as definições de dados usadas pelos componentes.
3. **Build/Dev Server** – Configurado via `vite.config.ts`, facilitando o desenvolvimento local rápido e a geração de builds de produção.
4. **Configurações** – `tsconfig.json` controla as opções do compilador TypeScript e `package.json` gerencia dependências e scripts.

A estrutura é modular, permitindo fácil expansão com novos componentes, serviços ou integrações API.

## Executando Localmente

**Pré-requisitos:** Node.js

1. Instale as dependências:
   `npm install`
2. Defina a variável `GEMINI_API_KEY` em [.env.local](.env.local) com sua chave Gemini API (caso a funcionalidade de API seja necessária).
3. Execute o app:
   `npm run dev`
