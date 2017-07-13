import gql from 'graphql-tag';

export const CreateUserMutation = gql`
mutation CreateUser($password: String!, $displayName: String!, $email: String!) {
  createUser(password: $password, displayName: $displayName, email: $email) {
    id
    email
    displayName
  }
}
`;
