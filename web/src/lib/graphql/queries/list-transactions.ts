import { gql } from "@apollo/client";

export const LIST_TRANSACTIONS = gql`
  query ListTransactions($filters: ListTransactionsFiltersInput) {
    listTransactions(filters: $filters) {
      message
      transactions {
        id
        title
        amount
        type
        description
        registerDate
        categoryId
        createdAt
        updatedAt
      }
      pagination {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
