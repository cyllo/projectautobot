import { Component, Input } from '@angular/core';
import { SnapshotStats, HeroSnapshotStats, CombatLifetimeStats, MatchAwardsStats } from '../../../models';

@Component({
  selector: 'ow-lifetime-stats',
  templateUrl: 'lifetime-stats.component.html',
  styleUrls: [ 'lifetime-stats.component.scss' ]
})

export class LifetimeStatsComponent {
  _snapshotStats: SnapshotStats;
  allHeroSnapshotStats: HeroSnapshotStats;
  combatLifetimeStats: CombatLifetimeStats;
  matchAwardsStats: MatchAwardsStats;

  assists;
  kdRatio;

  constructor() {}

  @Input()
  set snapshotStats(snapshotStats) {
    if (!snapshotStats) {
      return;
    }

    this._snapshotStats = snapshotStats;
    this.allHeroSnapshotStats = this._snapshotStats.allHeroesSnapshotStatistic;
    this.combatLifetimeStats = this.allHeroSnapshotStats.combatLifetimeStatistic;
    this.matchAwardsStats = this.allHeroSnapshotStats.matchAwardsStatistic;

    this.assists = this.combatLifetimeStats.defensiveAssists + this.combatLifetimeStats.offensiveAssists;
    this.kdRatio = this.combatLifetimeStats.finalBlows / this.combatLifetimeStats.deaths;
  }

  get snapshotStats() {
    return this._snapshotStats;
  }
}
