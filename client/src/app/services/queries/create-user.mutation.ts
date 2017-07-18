import gql from 'graphql-tag';

export const CreateUserMutation = gql`
mutation CreateUser($password: String!, $displayName: String!, $email: String!, $clientAuthToken: String) {
  createUser(password: $password, displayName: $displayName, email: $email, clientAuthToken: $clientAuthToken) {
    id
    email
    displayName
    battleNetTag
    battleNetId
  }
}
`;
