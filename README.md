# Final Pós Challenge

Este repositório contém o projeto completo desenvolvido para o desafio final de Pós-Graduação. A aplicação foi estruturada seguindo as melhores práticas de desenvolvimento Full Stack, utilizando **TypeScript** como linguagem base para garantir segurança e escalabilidade tanto no cliente quanto no servidor.

## 📁 Estrutura do Repositório

O projeto é dividido em dois pacotes principais:

- **[`/server`](./server):** API REST desenvolvida em Node.js, responsável por toda a lógica de negócio, autenticação e persistência de dados.
- **[`/web`](./web):** Interface do usuário desenvolvida em React, focada em uma experiência fluida, responsiva e performática.

## 🛠️ Tecnologias Utilizadas

### Base

- **TypeScript** (Linguagem principal de todo o ecossistema)

### Backend

- **Node.js**
- **Framework:** Fastify / Express
- **Banco de Dados:** SQLite / PostgreSQL (via Prisma ORM)

### Frontend

- **React.js**
- **Vite** (Build tool)
- **Tailwind CSS** (Estilização)
- **React Router DOM** (Navegação)

## 🚀 Como Executar o Projeto

Para rodar a aplicação completa, você precisará de duas instâncias do terminal:

### 1. Preparação

```bash
# Clone o repositório
git clone [https://github.com/IvanOliver131/final-pos-challenge.git](https://github.com/IvanOliver131/final-pos-challenge.git)

# Entre na pasta raiz
cd final-pos-challenge
```

### 2. Rodando o Backend (API)

```bash

cd server
npm install
npm run dev

```

### 3. Rodando o Frontend (Web)

# Em outro terminal

```bash
cd web
npm install
npm run dev
```

## 📝 Notas de Configuração

Certifique-se de configurar as variáveis de ambiente (.env) em ambos os diretórios seguindo os modelos de exemplo (.env.example), caso existam.

O backend geralmente roda na porta 3333 e o frontend na porta 5173.

Desenvolvido por Ivan Oliveira.
