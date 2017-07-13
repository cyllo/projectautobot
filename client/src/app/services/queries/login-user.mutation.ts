import gql from 'graphql-tag';

export const LoginUserMutation = gql`
mutation LoginUser($password: String!, $email: String!) {
  loginUser(password: $password, email: $email) {
    sessionInfo {
      exp
      token
    }
    user {
      id
      email
      battleNetId
      battleNetTag
      displayName
    }
  }
}
`;
