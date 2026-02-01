import { gql } from "@apollo/client";

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($data: CreateTransactionInput!) {
    createTransaction(data: $data) {
      transaction {
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
      message
    }
  }
`;
