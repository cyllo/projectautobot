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

export const getCurrentUserQuery = gql`
  query getCurrentUserQuery {
    me {
      id
      email
      battleNetId
      battleNetTag
      displayName
      followedGamerTags {
        id
        platform
        portraitUrl
        region
        tag
        overwatchName
        snapshotStatistics {
          profileSnapshotStatistic {
            profileStatistic {
              competitiveLevel
              competitiveRankUrl
              level
              levelUrl
              rankUrl
              totalGamesWon
            }
          }
        }
      }
      following {
        id
        email
        battleNetId
        battleNetTag
        displayName
        gamerTags {
          id
          platform
          portraitUrl
          region
          tag
          overwatchName
          snapshotStatistics {
            profileSnapshotStatistic {
              profileStatistic {
                competitiveLevel
                competitiveRankUrl
                level
                levelUrl
                rankUrl
                totalGamesWon
              }
            }
          }
        }
      }
    }
  }
`;
