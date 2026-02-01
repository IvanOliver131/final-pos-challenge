import { gql } from "@apollo/client";

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: String!, $data: UpdateCategoryInput!) {
    updateCategory(id: $id, data: $data) {
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

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id)
  }
`;
