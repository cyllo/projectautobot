import gql from 'graphql-tag';

export const gamerTagSearchQuery = gql`
  query GamerTagSearch($tag: String!) {
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
