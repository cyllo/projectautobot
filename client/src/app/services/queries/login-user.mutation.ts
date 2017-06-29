import gql from 'graphql-tag';

export const LoginUserMutation = gql`
mutation LoginUser($password: String!, $identifier: String!) {
  loginUser(password: $password, identifier: $identifier) {
    sessionInfo {
      exp
      token
    }
    user {
      id
      email
      username
    }
  }
}
`;
