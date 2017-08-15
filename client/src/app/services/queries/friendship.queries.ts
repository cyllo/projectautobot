import gql from 'graphql-tag';


export const AcceptFriendRequest = gql`
  mutation acceptFriendRequest($friendUserId: Int, $friendshipId: Int) {
    acceptFriendRequest(friendUserId: $friendUserId, friendshipId: $friendshipId) {
      id
      isAccepted
      friend {
        id
        email
        displayName
        battleNetId
        battleNetTag
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
`;

export const RejectFriendRequest = gql`
  mutation rejectFriendRequest($friendUserId: Int, $friendshipId: Int) {
    rejectFriendRequest(friendUserId: $friendUserId, friendshipId: $friendshipId) {
      rejected
    }
  }
`;

export const SendFriendRequest = gql`
  mutation sendFriendRequest($id: Int) {
    sendFriendRequest(friendUserId: $id) {
      id
      isAccepted
      insertedAt
      friend {
        displayName
        id
      }
    }
  }
`;

export const RemoveFriend = gql`
  mutation removeFriend($friendshipId: Int) {
    removeFriend(friendshipId: $friendshipId) {
      removed
    }
  }
`;

export const friendShipsQuery = gql`
  query friendShipsQuery($isIncoming: Boolean, $isAccepted: Boolean) {
    me {
      id
      friendships(isIncoming: $isIncoming, isAccepted: $isAccepted) {
        id
        insertedAt
        isAccepted
        updatedAt
        friend {
          id
          email
          displayName
          battleNetId
          battleNetTag
          insertedAt
          updatedAt
          gamerTags {
            id
            platform
            portraitUrl
            region
            tag
            snapshotStatistics {
              profileSnapshotStatistic {
                profileStatistic {
                  competitiveLevel
                }
              }
            }
          }
        }
      }
    }
  }
`;
