import gql from 'graphql-tag';

export const playerStatsChangeQuery = gql`
  query PlayerStatsChangeQuery($id: Int, $since: Date) {
    gamerTag(id: $id) {
      currentStatistics: snapshotStatistics(last: 1) {
        heroesTotalSnapshotStatistic(type: COMPETITIVE) {
          gameHistoryStatistic {
            winPercentage
          }
        }
      }
      pastStatistics: snapshotStatistics(startDate: $since, first: 1) {
        heroesTotalSnapshotStatistic(type: COMPETITIVE) {
          gameHistoryStatistic {
            winPercentage
          }
        }
      }
    }
  }
`;
