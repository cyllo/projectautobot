import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CurrentHero, GraphqlResponse } from '../models';
import { HeroAverages } from './queries';
import { toUpper } from 'ramda';

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

  averagesById(id: number, platform: string, region: string, type: string) {
    return this.apollo.query<HeroStatsAverageSearchResponse>({
      query: HeroAverages,
      variables: { heroId: id, platform, region, type: toUpper(type) }
    })
    .map(({ data: { heroStatisticsAggregateAverage } }: GraphqlResponse) => heroStatisticsAggregateAverage);
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
