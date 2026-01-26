# Exemplos Práticos - GraphQL Queries & Mutations

## 📌 Índice
1. [Autenticação](#autenticação)
2. [Categorias](#categorias)
3. [Transações](#transações)
4. [Filtros Avançados](#filtros-avançados)

---

## 🔐 Autenticação

### 1. Register (Criar Novo Usuário)

**Mutation:**
```graphql
mutation RegisterUser {
  register(data: {
    name: "João Silva"
    email: "joao@example.com"
    password: "senha123"
  }) {
    token
    refreshToken
    user {
      id
      name
      email
      createdAt
    }
  }
}
```

**Response Esperado:**
```json
{
  "data": {
    "register": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "João Silva",
        "email": "joao@example.com",
        "createdAt": "2026-01-26T10:30:00Z"
      }
    }
  }
}
```

---

### 2. Login (Autenticar Usuário)

**Mutation:**
```graphql
mutation LoginUser {
  login(data: {
    email: "joao@example.com"
    password: "senha123"
  }) {
    token
    refreshToken
    user {
      id
      name
      email
    }
  }
}
```

**Response Esperado:**
```json
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "João Silva",
        "email": "joao@example.com"
      }
    }
  }
}
```

---

## 📁 Categorias

### 1. Criar Categoria

**Mutation:**
```graphql
mutation CreateCategory {
  createCategory(data: {
    name: "Alimentação"
    color: "#FF5733"
  }) {
    category {
      id
      name
      color
      createdAt
    }
    message
  }
}
```

**Headers Necessários:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "data": {
    "createCategory": {
      "category": {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "Alimentação",
        "color": "#FF5733",
        "createdAt": "2026-01-26T10:35:00Z"
      },
      "message": "Categoria criada com sucesso!"
    }
  }
}
```

---

### 2. Listar Categorias

**Query:**
```graphql
query GetCategories {
  listCategories {
    categories {
      id
      name
      color
      createdAt
      updatedAt
    }
    message
  }
}
```

**Response:**
```json
{
  "data": {
    "listCategories": {
      "categories": [
        {
          "id": "660e8400-e29b-41d4-a716-446655440001",
          "name": "Alimentação",
          "color": "#FF5733",
          "createdAt": "2026-01-26T10:35:00Z",
          "updatedAt": "2026-01-26T10:35:00Z"
        },
        {
          "id": "660e8400-e29b-41d4-a716-446655440002",
          "name": "Transporte",
          "color": "#3366FF",
          "createdAt": "2026-01-26T10:36:00Z",
          "updatedAt": "2026-01-26T10:36:00Z"
        }
      ],
      "message": "Categorias listadas com sucesso!"
    }
  }
}
```

---

### 3. Atualizar Categoria

**Mutation:**
```graphql
mutation UpdateCategory {
  updateCategory(
    id: "660e8400-e29b-41d4-a716-446655440001"
    data: {
      name: "Comida e Bebida"
      color: "#FF7733"
    }
  ) {
    category {
      id
      name
      color
      updatedAt
    }
    message
  }
}
```

**Response:**
```json
{
  "data": {
    "updateCategory": {
      "category": {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "Comida e Bebida",
        "color": "#FF7733",
        "updatedAt": "2026-01-26T11:00:00Z"
      },
      "message": "Categoria atualizada com sucesso!"
    }
  }
}
```

---

### 4. Deletar Categoria

**Mutation:**
```graphql
mutation DeleteCategory {
  deleteCategory(id: "660e8400-e29b-41d4-a716-446655440001")
}
```

**Response:**
```json
{
  "data": {
    "deleteCategory": "Categoria deletada com sucesso!"
  }
}
```

---

## 💳 Transações

### 1. Criar Transação

**Mutation:**
```graphql
mutation CreateTransaction {
  createTransaction(data: {
    title: "Compra de mantimentos"
    amount: 125.50
    type: EXPENSE
    description: "Supermercado Giassi"
    registerDate: "2026-01-26T10:30:00Z"
    categoryId: "660e8400-e29b-41d4-a716-446655440001"
  }) {
    transaction {
      id
      title
      amount
      type
      description
      registerDate
      categoryId
      createdAt
    }
    message
  }
}
```

**Response:**
```json
{
  "data": {
    "createTransaction": {
      "transaction": {
        "id": "770e8400-e29b-41d4-a716-446655440100",
        "title": "Compra de mantimentos",
        "amount": 125.50,
        "type": "EXPENSE",
        "description": "Supermercado Giassi",
        "registerDate": "2026-01-26T10:30:00Z",
        "categoryId": "660e8400-e29b-41d4-a716-446655440001",
        "createdAt": "2026-01-26T10:35:00Z"
      },
      "message": "Transação criada com sucesso!"
    }
  }
}
```

---

### 2. Listar Transações (Sem Filtros)

**Query:**
```graphql
query GetTransactions {
  listTransactions {
    transactions {
      id
      title
      amount
      type
      description
      registerDate
      categoryId
      createdAt
    }
    pagination {
      total
      page
      limit
      totalPages
      hasNextPage
      hasPreviousPage
    }
    message
  }
}
```

**Response:**
```json
{
  "data": {
    "listTransactions": {
      "transactions": [
        {
          "id": "770e8400-e29b-41d4-a716-446655440100",
          "title": "Compra de mantimentos",
          "amount": 125.50,
          "type": "EXPENSE",
          "description": "Supermercado Giassi",
          "registerDate": "2026-01-26T10:30:00Z",
          "categoryId": "660e8400-e29b-41d4-a716-446655440001",
          "createdAt": "2026-01-26T10:35:00Z"
        }
      ],
      "pagination": {
        "total": 1,
        "page": 1,
        "limit": 10,
        "totalPages": 1,
        "hasNextPage": false,
        "hasPreviousPage": false
      },
      "message": "Transações listadas com sucesso!"
    }
  }
}
```

---

### 3. Atualizar Transação

**Mutation:**
```graphql
mutation UpdateTransaction {
  updateTransaction(
    id: "770e8400-e29b-41d4-a716-446655440100"
    data: {
      title: "Compra de frutas e legumes"
      amount: 142.75
    }
  ) {
    transaction {
      id
      title
      amount
      updatedAt
    }
    message
  }
}
```

**Response:**
```json
{
  "data": {
    "updateTransaction": {
      "transaction": {
        "id": "770e8400-e29b-41d4-a716-446655440100",
        "title": "Compra de frutas e legumes",
        "amount": 142.75,
        "updatedAt": "2026-01-26T11:15:00Z"
      },
      "message": "Transação atualizada com sucesso!"
    }
  }
}
```

---

### 4. Deletar Transação

**Mutation:**
```graphql
mutation DeleteTransaction {
  deleteTransaction(id: "770e8400-e29b-41d4-a716-446655440100")
}
```

**Response:**
```json
{
  "data": {
    "deleteTransaction": "Transação deletada com sucesso!"
  }
}
```

---

## 🔍 Filtros Avançados

### 1. Listar Transações por Tipo (EXPENSE)

**Query:**
```graphql
query GetExpenses {
  listTransactions(filters: {
    type: EXPENSE
    page: 1
    limit: 10
  }) {
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
    }
  }
}
```

---

### 2. Listar Transações por Período

**Query:**
```graphql
query GetTransactionsByPeriod {
  listTransactions(filters: {
    startDate: "2026-01-01T00:00:00Z"
    endDate: "2026-01-31T23:59:59Z"
    page: 1
    limit: 20
  }) {
    transactions {
      id
      title
      amount
      registerDate
    }
    pagination {
      total
      page
      totalPages
    }
  }
}
```

---

### 3. Buscar Transações por Palavra-Chave

**Query:**
```graphql
query SearchTransactions {
  listTransactions(filters: {
    search: "compra"
    page: 1
    limit: 10
  }) {
    transactions {
      id
      title
      description
      amount
    }
    pagination {
      total
    }
  }
}
```

---

### 4. Filtro Completo (Combinado)

**Query:**
```graphql
query AdvancedFilter {
  listTransactions(filters: {
    type: EXPENSE
    search: "supermercado"
    startDate: "2026-01-01T00:00:00Z"
    endDate: "2026-01-31T23:59:59Z"
    page: 1
    limit: 15
  }) {
    transactions {
      id
      title
      amount
      type
      description
      registerDate
    }
    pagination {
      total
      page
      limit
      totalPages
      hasNextPage
      hasPreviousPage
    }
    message
  }
}
```

---

## 🛠️ Casos de Erro

### 1. Usuário não autenticado

**Request:** Sem header `Authorization`

**Response:**
```json
{
  "errors": [
    {
      "message": "Usuário não autenticado!",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

---

### 2. Categoria com nome duplicado

**Mutation:**
```graphql
mutation DuplicateCategoryName {
  createCategory(data: {
    name: "Alimentação"
    color: "#FF5733"
  }) {
    category {
      id
      name
    }
    message
  }
}
```

**Response (Se categoria já existe):**
```json
{
  "errors": [
    {
      "message": "Categoria com este nome já existe!",
      "extensions": {
        "code": "BAD_REQUEST"
      }
    }
  ]
}
```

---

### 3. Recurso não encontrado

**Mutation:**
```graphql
mutation UpdateNonExistent {
  updateCategory(
    id: "invalid-id-uuid"
    data: { name: "Nova categoria" }
  ) {
    category {
      id
      name
    }
  }
}
```

**Response:**
```json
{
  "errors": [
    {
      "message": "Categoria não encontrada!",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

---

## 📱 Testando com cURL

### 1. Login via cURL

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(data: { email: \"joao@example.com\", password: \"senha123\" }) { token user { id name } } }"
  }'
```

### 2. Listar Categorias com Token

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query { listCategories { categories { id name color } message } }"
  }'
```

---

## 🧪 Variáveis GraphQL

Usando variáveis para melhor reutilização:

**Query com Variáveis:**
```graphql
mutation CreateCategoryWithVars($input: CreateCategoryInput!) {
  createCategory(data: $input) {
    category {
      id
      name
      color
    }
    message
  }
}
```

**JSON de Variáveis:**
```json
{
  "input": {
    "name": "Lazer",
    "color": "#00FF00"
  }
}
```

---

**Última Atualização:** 26/01/2026
