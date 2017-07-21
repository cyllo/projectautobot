import gql from 'graphql-tag';

export const gamerTagSearchMutation = gql`
  mutation GamerTagSearch($tag: String!) {
    searchGamerTag(tag: $tag) {
      id
      updatedAt
      totalGamesWon
      tag
      region
      portraitUrl
      platform
      overwatchName
      levelUrl
      level
      insertedAt
      competitiveRankUrl
      competitiveLevel
    }
  }
`;
