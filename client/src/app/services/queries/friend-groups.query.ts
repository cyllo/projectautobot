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
              competitiveLevel
              id
              platform
              portraitUrl
              region
              tag
            }
          }
        }
      }
    }
  }
`;
