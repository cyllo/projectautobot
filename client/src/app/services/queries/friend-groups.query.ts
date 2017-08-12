import gql from 'graphql-tag';


export const FriendGroupsQuery = gql`
  query friendGroupsQuery {
    me {
      friendGroups {
        id
        insertedAt
        name
        updatedAt
        friendships {
          id
          friendId
          insertedAt
          updatedAt
          friend {
            battleNetId
            battleNetTag
            displayName
            email
            id
            insertedAt
            updatedAt
            gamerTags {
              id
              platform
              portraitUrl
              region
              snapshotStatistics {
                profileSnapshotStatistic {
                  profileStatistic {
                    competitiveLevel
                  }
                }
              }
              tag
            }
          }
        }
      }
    }
  }
`;
