import gql from 'graphql-tag';

export const CreateUserMutation = gql`
mutation CreateUser($password: String!, $username: String!, $email: String!) {
  createUser(password: $password, username: $username, email: $email) {
    id
    email
    username
  }
}
`;
