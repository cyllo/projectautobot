import { Component } from '@angular/core';
import { snapshotStatsAverageSearchQuery } from '../../queries';
import { Apollo } from 'apollo-angular';
import { CurrentHero } from '../../models';

interface SnapshotStatsAverageSearchResponse {
  snapshotsStatisticsAverage: CurrentHero;
  loading: boolean;
}

@Component({
  selector: 'ow-heroes',
  templateUrl: 'heroes.component.html',
  styleUrls: [ 'heroes.component.scss' ]
})
export class HeroesComponent {
  heroes;
  isCompetitive = true;

  constructor(private apollo: Apollo) {
    this.loadHeroData();
  }

  loadHeroData() {
    return this.apollo.query<SnapshotStatsAverageSearchResponse>({
      query: snapshotStatsAverageSearchQuery,
      variables: { isCompetitive: this.isCompetitive }
    })
    .filter(s => !!s.data)
    .subscribe(s => {
      this.heroes = s.data.snapshotsStatisticsAverage.heroSnapshotStatistics;
    });
  }
}
