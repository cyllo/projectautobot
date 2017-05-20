import { AfterContentInit, Component, Input } from '@angular/core';
import { Player, SnapshotStats, HeroSnapshotStats, CombatLifetimeStats, MatchAwardsStats } from '../../models/player.model';

@Component({
  selector: 'ow-hero-card',
  templateUrl: 'hero-card.component.html',
  styleUrls: [ 'hero-card.component.scss' ]
})

export class HeroCardComponent implements AfterContentInit {
  @Input() player: Player;
  snapshotStats: SnapshotStats;
  allHeroSnapshotStats: HeroSnapshotStats;
  combatLifetimeStats: CombatLifetimeStats;
  matchAwardsStats: MatchAwardsStats;

  constructor() {}

  ngAfterContentInit() {
    this.snapshotStats = this.player.snapshotStatistics[this.player.snapshotStatistics.length - 1];
    this.allHeroSnapshotStats = this.snapshotStats.allHeroesSnapshotStatistic;
    this.combatLifetimeStats = this.allHeroSnapshotStats.combatLifetimeStatistic;
    this.matchAwardsStats = this.allHeroSnapshotStats.matchAwardsStatistic;
  }
}
