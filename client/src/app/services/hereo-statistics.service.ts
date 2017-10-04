import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CurrentHero } from '../models';
import { HeroAverages } from './queries';

interface HeroStatsAverageSearchResponse {
  heroStatisticsAverage: CurrentHero;
  loading: boolean;
}

// interface SnapshotStatsAverageSearchResponse {
//   snapshotsStatisticsAverage: CurrentHero;
//   loading: boolean;
// }

@Injectable()
export class HeroStatistics {
  constructor(private apollo: Apollo) {}

  averagesById(id) {
    return this.apollo.query<HeroStatsAverageSearchResponse>({
      query: HeroAverages,
      variables: { heroId: id }
    })
    .map(({ data }) => data);
  }

  // getSnapshot() {
  //   return this.apollo.query<SnapshotStatsAverageSearchResponse>({
  //     query: SnapshotAverage,
  //     variables: { type: 'COMPETITIVE' }
  //   })
  //   .filter(s => !!s.data)
  //   .map(({ data: { snapshotsStatisticsAverage: { heroSnapshotStatistics } } }) => heroSnapshotStatistics);
  // }
}
