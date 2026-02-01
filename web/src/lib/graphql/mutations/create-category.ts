import { gql } from "@apollo/client";

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      message
      category {
        id
        name
        color
        icon
        description
        createdAt
        updatedAt
      }
    }
  }
`;
