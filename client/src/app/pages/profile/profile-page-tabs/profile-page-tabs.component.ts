import { AfterContentInit, Component, Input } from '@angular/core';
import { Player, SnapshotStats, HeroSnapshotStats, CombatLifetimeStats, MatchAwardsStats } from '../../../models';

@Component({
  selector: 'ow-profile-page-tabs',
  templateUrl: 'profile-page-tabs.component.html',
  styleUrls: ['profile-page-tabs.component.scss']
})

export class ProfilePageTabsComponent implements AfterContentInit {
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
