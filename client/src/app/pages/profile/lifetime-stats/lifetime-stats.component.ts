import { AfterContentInit, Component, Input } from '@angular/core';
import { SnapshotStats, HeroSnapshotStats, CombatLifetimeStats, MatchAwardsStats } from '../../../models';

@Component({
  selector: 'ow-lifetime-stats',
  templateUrl: 'lifetime-stats.component.html',
  styleUrls: [ 'lifetime-stats.component.scss' ]
})

export class LifetimeStatsComponent implements AfterContentInit {
  @Input() snapshotStats: SnapshotStats;
  allHeroSnapshotStats: HeroSnapshotStats;
  combatLifetimeStats: CombatLifetimeStats;
  matchAwardsStats: MatchAwardsStats;

  assists;
  kdRatio;

  constructor() {}

  ngAfterContentInit() {
    this.allHeroSnapshotStats = this.snapshotStats.allHeroesSnapshotStatistic;
    this.combatLifetimeStats = this.allHeroSnapshotStats.combatLifetimeStatistic;
    this.matchAwardsStats = this.allHeroSnapshotStats.matchAwardsStatistic;

    this.assists = this.combatLifetimeStats.defensiveAssists + this.combatLifetimeStats.offensiveAssists;
    this.kdRatio = this.combatLifetimeStats.finalBlows / this.combatLifetimeStats.deaths;
  }
}
