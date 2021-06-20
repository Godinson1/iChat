import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  query loginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      token
      username
      photoUrl
      createdAt
    }
  }
`;

export const REGISTER_USER = gql`
  mutation registerUser(
    $email: String!
    $username: String!
    $password: String!
  ) {
    registerUser(email: $email, username: $username, password: $password) {
      token
      username
      photoUrl
      createdAt
    }
  }
`;
