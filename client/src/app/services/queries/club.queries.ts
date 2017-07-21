import gql from 'graphql-tag';


export const UpdateClub = gql`
  mutation updateClub($id: Int!, $name: String!) {
    updateFriendGroup(id: $id, name: $name) {
      id
      insertedAt
      name
      updatedAt
      friendships {
        id
        friendId
        isAccepted
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
`;

export const RemoveFriendFromClub = gql`
  mutation removeFriendFromClub($friendshipId: Int!, $clubId: Int!) {
    removeFriendGroupFriendship(friendshipId: $friendshipId, userFriendGroupId: $clubId) {
      id
    }
  }
`;

export const AddFriend = gql`
  mutation addFriend($friendshipId: Int!, $clubId: Int!) {
    addFriendGroupFriendship(friendshipId: $friendshipId, userFriendGroupId: $clubId) {
      id
    }
  }
`;

export const DeleteClub = gql`
  mutation deleteClub($id: Int!) {
    deleteFriendGroup(id: $id) {
      deleted
    }
  }
`;

export const CreateClub = gql`
  mutation createClub ($name: String!) {
    createFriendGroup(name: $name) {
      id
      name
      insertedAt
      updatedAt
      friendships {
        id
        isAccepted
        insertedAt
        updatedAt
        friend {
          id
          email
          displayName
          battleNetId
          battleNetTag
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
`;
