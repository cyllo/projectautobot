import { AfterContentInit, Component, Input } from '@angular/core';
import { Player, SnapshotStats, HeroSnapshotStats, CombatLifetimeStats, MatchAwardsStats } from '../../../models';

@Component({
  selector: 'ow-career',
  templateUrl: 'career.component.html',
  styleUrls: [ 'career.component.scss' ]
})

export class CareerComponent implements AfterContentInit {
  @Input() player: Player;
  snapshotStats: SnapshotStats;
  allHeroSnapshotStats: HeroSnapshotStats;
  combatLifetimeStats: CombatLifetimeStats;
  matchAwardsStats: MatchAwardsStats;
  careerData;

  constructor() {}

  ngAfterContentInit() {
    this.snapshotStats = this.player.snapshotStatistics[this.player.snapshotStatistics.length - 1];
    this.allHeroSnapshotStats = this.snapshotStats.allHeroesSnapshotStatistic;
    this.combatLifetimeStats = this.allHeroSnapshotStats.combatLifetimeStatistic;
    this.matchAwardsStats = this.allHeroSnapshotStats.matchAwardsStatistic;

    this.careerData = [
      {
        title: 'Kills',
        value: this.combatLifetimeStats.finalBlows
      }, {
        title: 'Assists',
        value: this.combatLifetimeStats.offensiveAssists + this.combatLifetimeStats.defensiveAssists
      }, {
        title: 'Damage Done',
        value: this.combatLifetimeStats.damageDone
      }, {
        title: 'Damage Blocked',
        value: this.combatLifetimeStats.damageBlocked
      }, {
        title: 'Healing Done',
        value: this.combatLifetimeStats.healingDone
      }, {
        title: 'Medals',
        value: this.matchAwardsStats.totalMedals
      }
    ];
  }
}
