# Final Pós Challenge - Frontend (Web)

Este é o módulo Frontend da aplicação **Final Pós Challenge**, desenvolvido como projeto de conclusão de pós-graduação. A aplicação consiste em uma interface moderna e responsiva, focada na experiência do usuário e no consumo eficiente de APIs.

## 🚀 Tecnologias

O projeto foi construído utilizando as seguintes tecnologias:

- **[React](https://reactjs.org/)** - Biblioteca JavaScript para construção de interfaces.
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript que adiciona tipagem estática.
- **[Vite](https://vitejs.dev/)** - Build tool ultra-rápida para o frontend.
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS para estilização ágil.
- **[React Router DOM](https://reactrouter.com/)** - Gerenciamento de rotas e navegação.
- **[Axios](https://axios-http.com/)** - Cliente HTTP para integração com o Backend.
- **[Lucide Icons](https://lucide.dev/)** - Conjunto de ícones leves e elegantes.

## 📦 Instalação e Configuração

Certifique-se de ter o **Node.js** e um gerenciador de pacotes (npm ou yarn) instalados.

1.  **Acesse a pasta do projeto:**

    ```bash
    cd final-pos-challenge/web
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configuração de Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz da pasta `web` e configure a URL da sua API:
    ```env
    VITE_API_URL=http://localhost:3333
    ```

## 💻 Execução

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

Após iniciar, a aplicação estará disponível em http://localhost:5173 (ou na porta informada pelo Vite no terminal).

## 🏗️ Estrutura de Pastas

src/
├── assets/ # Arquivos de mídia e imagens
├── components/ # Componentes reutilizáveis da interface
├── contexts/ # Contextos para gerenciamento de estado global
├── hooks/ # Hooks personalizados
├── pages/ # Telas/Páginas da aplicação
├── services/ # Configurações de API e chamadas HTTP
├── styles/ # Estilos globais e configurações do Tailwind
└── utils/ # Funções auxiliares e formatadores

## 🛠️ Scripts Disponíveis

npm run dev: Inicia o servidor local de desenvolvimento.

npm run build: Gera a build otimizada para produção na pasta dist.

npm run preview: Visualiza localmente o projeto após a build.

npm run lint: Executa a varificação de erros e padronização do código.

Desenvolvido por Ivan Oliveira.
