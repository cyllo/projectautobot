import gql from 'graphql-tag';

export const FollowGamerTagMutation = gql`
  mutation FollowGamerTag($gamerTagId: Int!) {
    followGamerTag(gamerTagId: $gamerTagId) {
      insertedAt,
      updatedAt
    }
  }
`;

export const UnfollowUserMutation = gql`
  mutation unfollowUser($userId: Int!) {
    unfollowUser(userId: $userId) {
      unfollowed
    }
  }
`;

export const UnfollowGamerTagMutation = gql`
  mutation unfollowGamerTag($gamerTagId: Int!) {
    unfollowGamerTag(gamerTagId: $gamerTagId) {
      unfollowed
    }
  }
`;
