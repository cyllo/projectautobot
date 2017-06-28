import gql from 'graphql-tag';

export const LoginUserMutation = gql`
mutation LoginUser($password: String!, $identifier: String!) {
  loginUser(password: $password, identifier: $identifier) {
    user {
      id
      email
      username
    }
  }
}
`;
