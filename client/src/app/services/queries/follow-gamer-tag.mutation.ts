import gql from 'graphql-tag';

export const FollowGamerTagMutation = gql`
  mutation FollowGamerTag($gamerTagId: Int!) {
    followGamerTag(gamerTagId: $gamerTagId) {
      insertedAt,
      updatedAt
    }
  }
`;
