import gql from 'graphql-tag';

export const ConnectUserToBattleNetMutation = gql`
mutation ConnectUserToBattleNet($clientAuthToken: String!) {
  connectUserToBattleNet(clientAuthToken: $clientAuthToken) {
    id
    email
    username
    battleNetId
    battleNetTag
  }
}
`;
