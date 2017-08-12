import gql from 'graphql-tag';

export const gamerTagSearchMutation = gql`
  mutation GamerTagSearch($tag: String!) {
    searchGamerTag(tag: $tag) {
      id
      updatedAt
      tag
      region
      portraitUrl
      platform
      overwatchName
      insertedAt
      snapshotStatistics(last: 1) {
        id
        gamerTagId
        profileSnapshotStatistic {
          profileStatistic {
            level
            levelUrl
            rankUrl
            competitiveLevel
            competitiveRankUrl
            totalGamesWon
          }
        }
      }
    }
  }
`;
