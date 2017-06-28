import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CurrentHero } from '../models';
import { HeroStatsAverageSearchQuery, snapshotStatsAverageSearchQuery } from './queries';

interface HeroStatsAverageSearchResponse {
  heroStatisticsAverage: CurrentHero;
  loading: boolean;
}

interface SnapshotStatsAverageSearchResponse {
  snapshotsStatisticsAverage: CurrentHero;
  loading: boolean;
}

@Injectable()
export class HeroStatistics {
  constructor(private apollo: Apollo) {}

  averagesById(id) {
    return this.apollo.query<HeroStatsAverageSearchResponse>({
      query: HeroStatsAverageSearchQuery,
      variables: { heroId: id }
    })
    .filter(s => !!s.data.heroStatisticsAverage)
    .map(({data: { heroStatisticsAverage } }) => heroStatisticsAverage);
  }

  getSnapshot() {
    return this.apollo.query<SnapshotStatsAverageSearchResponse>({
      query: snapshotStatsAverageSearchQuery,
      variables: { isCompetitive: true }
    })
    .filter(s => !!s.data)
    .map(({ data: { snapshotsStatisticsAverage: { heroSnapshotStatistics } } }) => heroSnapshotStatistics);
  }
}
