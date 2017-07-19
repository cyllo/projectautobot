import gql from 'graphql-tag';

export const playerStatsChangeQuery = gql`
  query PlayerStatsChangeQuery($id: Int, $since: Date) {
    gamerTag(id: $id) {
      currentStatistics: snapshotStatistics(isCompetitive: true, last: 1) {
        allHeroesSnapshotStatistic {
          gameHistoryStatistic {
            winPercentage
          }
        }
      }
      pastStatistics: snapshotStatistics(isCompetitive: true, startDate: $since, first: 1) {
        allHeroesSnapshotStatistic {
          gameHistoryStatistic {
            winPercentage
          }
        }
      }
    }
  }
`;
