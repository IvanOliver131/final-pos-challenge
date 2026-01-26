# Documentação - Servidor GraphQL - POS Challenge

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Modelos de Dados](#modelos-de-dados)
6. [Módulos e Funcionalidades](#módulos-e-funcionalidades)
7. [Autenticação](#autenticação)
8. [Endpoints GraphQL](#endpoints-graphql)
9. [Como Executar](#como-executar)
10. [Variáveis de Ambiente](#variáveis-de-ambiente)

---

## 🎯 Visão Geral

Este é um servidor GraphQL desenvolvido para um sistema de gestão de finanças pessoais (Point of Sale - POS). O servidor fornece funcionalidades de autenticação, gerenciamento de transações e categorias de gastos, utilizando TypeScript, Apollo Server e Prisma como ORM.

**Principais Features:**

- ✅ Autenticação com JWT
- ✅ CRUD completo de Transações
- ✅ CRUD completo de Categorias
- ✅ Filtros avançados em transações
- ✅ Segurança com middleware de autenticação
- ✅ Banco de dados SQLite com Prisma

---

## 🏗️ Arquitetura

O projeto segue a arquitetura em camadas:

```
┌─────────────────────────────────────────┐
│         GraphQL API (Apollo)            │
├─────────────────────────────────────────┤
│         Resolvers (Controllers)         │
├─────────────────────────────────────────┤
│    Services (Business Logic)            │
├─────────────────────────────────────────┤
│    DTOs & Models (Data Transfer)        │
├─────────────────────────────────────────┤
│    Prisma Client (ORM)                  │
├─────────────────────────────────────────┤
│    SQLite Database                      │
└─────────────────────────────────────────┘
```

**Padrão de Projeto:**

- **MVC Adaptado**: Resolvers funcionam como Controllers
- **Service Layer**: Lógica de negócio isolada e reutilizável
- **DTO Pattern**: Separação clara entre entrada e saída de dados
- **Middleware**: Autenticação em nível de GraphQL

---

## 💻 Stack Tecnológico

### Dependências Principais:

| Pacote            | Versão      | Propósito                           |
| ----------------- | ----------- | ----------------------------------- |
| `@apollo/server`  | ^5.3.0      | Servidor GraphQL                    |
| `type-graphql`    | ^2.0.0-rc.2 | Decoradores TypeScript para GraphQL |
| `@prisma/client`  | ^6.16.2     | ORM para banco de dados             |
| `express`         | ^5.2.1      | Framework web                       |
| `bcryptjs`        | ^3.0.3      | Hash de senhas                      |
| `jsonwebtoken`    | ^9.0.3      | Geração de tokens JWT               |
| `cors`            | ^2.8.6      | CORS middleware                     |
| `graphql-scalars` | ^1.25.0     | Escalares GraphQL customizados      |

### Dependências de Desenvolvimento:

- TypeScript `^5.7.3`
- tsx (TypeScript Executor)
- Tipos do Node.js e bibliotecas

---

## 📁 Estrutura de Pastas

```
server/
├── prisma/
│   ├── schema.prisma          # Definição do banco de dados
│   ├── prisma.ts              # Instância do Prisma Client
│   └── migrations/            # Histórico de migrações
│
├── src/
│   ├── index.ts               # Entry point da aplicação
│   ├── dtos/
│   │   ├── input/             # DTOs de entrada
│   │   │   ├── auth.input.ts
│   │   │   ├── transaction.input.ts
│   │   │   └── category.input.ts
│   │   └── output/            # DTOs de saída
│   │       ├── auth.output.ts
│   │       ├── transaction.output.ts
│   │       └── category.output.ts
│   │
│   ├── models/                # Modelos GraphQL
│   │   ├── user.model.ts
│   │   ├── transaction.model.ts
│   │   └── category.model.ts
│   │
│   ├── resolvers/             # GraphQL Resolvers
│   │   ├── auth.resolver.ts
│   │   ├── transaction.resolver.ts
│   │   └── category.resolver.ts
│   │
│   ├── services/              # Lógica de negócio
│   │   ├── auth.service.ts
│   │   ├── transaction.service.ts
│   │   └── category.service.ts
│   │
│   ├── middlewares/           # Middlewares
│   │   └── auth.middleware.ts
│   │
│   ├── graphql/
│   │   └── context/
│   │       └── index.ts       # Contexto GraphQL
│   │
│   └── utils/                 # Utilidades
│       ├── hash.ts            # Funções de hash
│       └── jwt.ts             # Funções JWT
│
├── schema.graphql             # Schema gerado automaticamente
├── package.json
├── tsconfig.json
└── .env                       # Variáveis de ambiente
```

---

## 📊 Modelos de Dados

### 1. **User**

```typescript
{
  id: string (UUID)
  name: string
  email: string (UNIQUE)
  password: string (hash bcrypt)
  transactions: Transaction[]
  categories: Category[]
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 2. **Transaction**

```typescript
{
  id: string(UUID);
  title: string;
  amount: number(Float);
  type: TransactionType(INCOME | EXPENSE);
  description: string(opcional);
  registerDate: DateTime;
  userId: string(FK);
  categoryId: string(FK);
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### 3. **Category**

```typescript
{
  id: string (UUID)
  name: string
  color: string (opcional - hex color)
  userId: string (FK)
  transactions: Transaction[]
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Restrições:**

- Cada usuário tem suas próprias categorias (constraint: `name + userId` UNIQUE)
- Categorias podem ter múltiplas transações
- Ao deletar um usuário, suas transações e categorias são deletadas (CASCADE)

---

## 🔧 Módulos e Funcionalidades

### 1. **Auth Module** 🔐

**Arquivo:** `auth.resolver.ts`, `auth.service.ts`

#### Mutations:

- `register(data: RegisterInput)` → RegisterOutput
  - Cria novo usuário
  - Hash da senha com bcryptjs
  - Retorna JWT tokens e dados do usuário

- `login(data: LoginInput)` → LoginOutput
  - Autentica usuário
  - Valida email e senha
  - Retorna JWT tokens

#### Inputs:

```typescript
RegisterInput {
  name: string
  email: string
  password: string
}

LoginInput {
  email: string
  password: string
}
```

#### Outputs:

```typescript
RegisterOutput / LoginOutput {
  token: string (JWT)
  refreshToken: string (JWT)
  user: UserModel
}
```

---

### 2. **Transaction Module** 💳

**Arquivo:** `transaction.resolver.ts`, `transaction.service.ts`

#### Queries:

- `listTransactions(filters?: ListTransactionsFiltersInput)` → TransactionsListOutput
  - Lista transações do usuário autenticado
  - Suporta paginação
  - Filtros avançados

#### Mutations:

- `createTransaction(data: CreateTransactionInput)` → TransactionOutput
  - Cria nova transação
  - Requer autenticação

- `updateTransaction(id: string, data: UpdateTransactionInput)` → TransactionOutput
  - Atualiza transação existente
  - Validações de segurança

- `deleteTransaction(id: string)` → string
  - Deleta transação
  - Retorna mensagem de sucesso

#### Filtros Disponíveis:

```typescript
ListTransactionsFiltersInput {
  search?: string              // Busca em título e descrição
  type?: TransactionType       // INCOME ou EXPENSE
  startDate?: Date             // Data inicial
  endDate?: Date               // Data final
  page?: number (default: 1)
  limit?: number (default: 10)
}
```

#### Response:

```typescript
TransactionsListOutput {
  transactions: TransactionModel[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  message: string
}
```

---

### 3. **Category Module** 📁

**Arquivo:** `category.resolver.ts`, `category.service.ts`

#### Queries:

- `listCategories()` → CategoriesListOutput
  - Lista todas as categorias do usuário
  - Ordenadas por data de criação (descendente)

#### Mutations:

- `createCategory(data: CreateCategoryInput)` → CategoryOutput
  - Cria nova categoria
  - Valida nome único por usuário
  - Requer autenticação

- `updateCategory(id: string, data: UpdateCategoryInput)` → CategoryOutput
  - Atualiza categoria existente
  - Validações de propriedade

- `deleteCategory(id: string)` → string
  - Deleta categoria
  - Retorna mensagem de sucesso

#### Inputs:

```typescript
CreateCategoryInput {
  name: string (obrigatório)
  color?: string (opcional - hex color)
}

UpdateCategoryInput {
  name?: string
  color?: string
}
```

#### Output:

```typescript
CategoryOutput {
  category: CategoryModel
  message: string
}

CategoriesListOutput {
  categories: CategoryModel[]
  message: string
}
```

---

## 🔐 Autenticação

### Fluxo de Autenticação:

1. **Registro/Login:**
   - Usuário envia credenciais
   - Sistema valida e gera JWT token

2. **Usando Token:**
   - Cliente adiciona header: `Authorization: Bearer <token>`
   - Middleware valida token antes de executar resolver

3. **Middleware IsAuth:**

```typescript
// Arquivo: src/middlewares/auth.middleware.ts
// Protege resolvers que necessitam autenticação
@UseMiddleware(IsAuth)
```

### Geração de Tokens:

- **Algoritmo:** HS256
- **Duração:** 1 dia
- **Payload:** `{ id: userId, email: userEmail }`

---

## 🔌 Endpoints GraphQL

### URL: `http://localhost:4000/graphql`

### Query Example - Listar Categorias:

```graphql
query {
  listCategories {
    categories {
      id
      name
      color
      createdAt
    }
    message
  }
}
```

### Mutation Example - Criar Transação:

```graphql
mutation {
  createTransaction(
    data: {
      title: "Café"
      amount: 15.50
      type: EXPENSE
      registerDate: "2026-01-26T10:30:00Z"
      categoryId: "category-uuid-here"
      description: "Café da manhã"
    }
  ) {
    transaction {
      id
      title
      amount
      type
    }
    message
  }
}
```

### Query Example - Listar Transações com Filtros:

```graphql
query {
  listTransactions(
    filters: {
      type: EXPENSE
      startDate: "2026-01-01T00:00:00Z"
      endDate: "2026-01-31T23:59:59Z"
      page: 1
      limit: 10
    }
  ) {
    transactions {
      id
      title
      amount
      type
      registerDate
    }
    pagination {
      total
      page
      totalPages
      hasNextPage
    }
  }
}
```

---

## 🚀 Como Executar

### Pré-requisitos:

- Node.js v16+ (recomendado v18+)
- npm ou yarn

### Passos:

1. **Instalar dependências:**

```bash
npm install
```

2. **Configurar banco de dados:**

```bash
# Criar/atualizar banco com migrações
npx prisma migrate dev
```

3. **Iniciar servidor em desenvolvimento:**

```bash
npm run dev
```

4. **Servidor estará rodando em:**

```
http://localhost:4000/graphql
```

### Comandos Úteis:

```bash
# Ver/editar dados no banco (Prisma Studio)
npx prisma studio

# Criar nova migração
npx prisma migrate dev --name nome_da_migracao

# Resetar banco de dados (⚠️ Cuidado: deleta todos dados)
npx prisma migrate reset
```

---

## 🔑 Variáveis de Ambiente

Criar arquivo `.env` na raiz do `server/`:

```env
# Banco de dados
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="sua-chave-secreta-aqui"

# Variáveis opcionais
NODE_ENV=development
PORT=4000
CORS_ORIGIN=http://127.0.0.1:5173
```

**Exemplo arquivo `.env.example`:**

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="jwt-secret-key"
```

---

## 📝 Fluxo de Desenvolvimento

### Padrão de Adição de Nova Feature:

1. **Atualizar Prisma Schema** (`prisma/schema.prisma`)

   ```bash
   npx prisma migrate dev --name nome_migration
   ```

2. **Criar DTO de Entrada** (`src/dtos/input/`)

   ```typescript
   @InputType()
   export class CreateFeatureInput {}
   ```

3. **Criar DTO de Saída** (`src/dtos/output/`)

   ```typescript
   @ObjectType()
   export class FeatureOutput {}
   ```

4. **Criar Model GraphQL** (`src/models/`)

   ```typescript
   @ObjectType()
   export class FeatureModel {}
   ```

5. **Criar Service** (`src/services/`)
   - Lógica de negócio
   - Validações
   - Interação com banco

6. **Criar Resolver** (`src/resolvers/`)
   - Queries e Mutations
   - Middlewares de autenticação
   - Documentação

7. **Registrar no Main** (`src/index.ts`)
   ```typescript
   resolvers: [..., FeatureResolver]
   ```

---

## 🔒 Segurança

### Implementadas:

- ✅ Hash de senhas com bcryptjs
- ✅ JWT para autenticação stateless
- ✅ Middleware IsAuth para proteção de resolvers
- ✅ Validação de propriedade (usuário pode acessar apenas seus dados)
- ✅ CORS configurado
- ✅ Validações de entrada com type-graphql

### Boas Práticas:

- Nunca retornar senha em queries
- Sempre usar `@UseMiddleware(IsAuth)` em resolvers protegidos
- Validar propriedade de recursos antes de operações
- Usar variáveis de ambiente para dados sensíveis

---

## 📚 Referências

- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/)
- [Type-GraphQL Docs](https://typegraphql.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [GraphQL Spec](https://spec.graphql.org/)

---

## ✅ Checklist de Deploy

- [ ] Configurar variáveis de ambiente em produção
- [ ] Usar banco de dados persistente (não SQLite)
- [ ] Implementar rate limiting
- [ ] Configurar logging adequado
- [ ] Usar HTTPS em produção
- [ ] Validar JWT_SECRET complexa
- [ ] Testar todos os endpoints
- [ ] Backup do banco de dados
- [ ] Monitoramento de erros
- [ ] Documentação API atualizada

---

**Última Atualização:** 26/01/2026
**Versão:** 1.0.0
