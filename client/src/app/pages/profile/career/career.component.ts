import { AfterContentInit, Component, Input } from '@angular/core';
import { SnapshotStats, HeroSnapshotStats, CombatLifetimeStats, MatchAwardsStats } from '../../../models';

@Component({
  selector: 'ow-career',
  templateUrl: 'career.component.html',
  styleUrls: [ 'career.component.scss' ]
})

export class CareerComponent implements AfterContentInit {
  @Input() snapshotStats: SnapshotStats;
  allHeroSnapshotStats: HeroSnapshotStats;
  combatLifetimeStats: CombatLifetimeStats;
  matchAwardsStats: MatchAwardsStats;
  careerData;

  constructor() {}

  ngAfterContentInit() {
    this.allHeroSnapshotStats = this.snapshotStats.allHeroesSnapshotStatistic;
    this.combatLifetimeStats = this.allHeroSnapshotStats.combatLifetimeStatistic;
    this.matchAwardsStats = this.allHeroSnapshotStats.matchAwardsStatistic;

    let totalTimePlayedInMins = this.allHeroSnapshotStats.gameHistoryStatistic.timePlayed / 60;

    this.careerData = [
      {
        title: 'Kills',
        value: this.combatLifetimeStats.finalBlows / totalTimePlayedInMins
      }, {
        title: 'Assists',
        value: (this.combatLifetimeStats.offensiveAssists + this.combatLifetimeStats.defensiveAssists) / totalTimePlayedInMins
      }, {
        title: 'Damage Done',
        value: this.combatLifetimeStats.damageDone / totalTimePlayedInMins
      }, {
        title: 'Damage Blocked',
        value: this.combatLifetimeStats.damageBlocked / totalTimePlayedInMins
      }, {
        title: 'Healing Done',
        value: this.combatLifetimeStats.healingDone / totalTimePlayedInMins
      }, {
        title: 'Medals',
        value: this.matchAwardsStats.totalMedals / totalTimePlayedInMins
      }
    ];
  }
}
