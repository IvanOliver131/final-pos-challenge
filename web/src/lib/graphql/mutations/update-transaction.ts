import { gql } from "@apollo/client";

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: String!, $data: UpdateTransactionInput!) {
    updateTransaction(id: $id, data: $data) {
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
