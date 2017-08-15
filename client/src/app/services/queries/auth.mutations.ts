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
    }
  }
}
`;


export const logoutMutation = gql`
  mutation logoutUser {
    logoutUser {
      loggedOut
    }
  }
`;
