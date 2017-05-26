import { AfterContentInit, Component, Input } from '@angular/core';
import { Player, SnapshotStats, HeroSnapshotStats, CombatLifetimeStats, MatchAwardsStats } from '../../../models';

@Component({
  selector: 'ow-profile-header',
  templateUrl: 'profile-header.component.html',
  styleUrls: ['profile-header.component.scss']
})

export class ProfileHeaderComponent implements AfterContentInit {
  @Input() player: Player;
  snapshotStats: SnapshotStats;
  allHeroSnapshotStats: HeroSnapshotStats;
  combatLifetimeStats: CombatLifetimeStats;
  matchAwardsStats: MatchAwardsStats;
  winRate: number;

  constructor() {}

  ngAfterContentInit() {
    this.snapshotStats = this.player.snapshotStatistics[this.player.snapshotStatistics.length - 1];
    this.allHeroSnapshotStats = this.snapshotStats.allHeroesSnapshotStatistic;
    this.combatLifetimeStats = this.allHeroSnapshotStats.combatLifetimeStatistic;
    this.matchAwardsStats = this.allHeroSnapshotStats.matchAwardsStatistic;
    this.winRate = this.allHeroSnapshotStats.gameHistoryStatistic.gamesWon /
      this.allHeroSnapshotStats.gameHistoryStatistic.gamesPlayed * 100;

  }
}
