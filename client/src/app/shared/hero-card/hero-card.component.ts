import { Component, Input, OnInit } from '@angular/core';
import { CombatLifetimeStats, HeroSnapshotStats, MatchAwardsStats } from '../../models/player.model';

@Component({
  selector: 'ow-hero-card',
  templateUrl: 'hero-card.component.html',
  styleUrls: [ 'hero-card.component.scss' ]
})

export class HeroCardComponent implements OnInit {
  @Input() heroSnap: HeroSnapshotStats;
  combatLifetimeStats: CombatLifetimeStats;
  matchAwardsStats: MatchAwardsStats;
  statsData;
  winRate;
  totalTimeMins;
  timeOnFire;

  constructor() {
    // console.log(this.hero);
  }

  ngOnInit() {
    this.combatLifetimeStats = this.heroSnap.combatLifetimeStatistic;
    this.matchAwardsStats = this.heroSnap.matchAwardsStatistic;
    this.winRate = this.heroSnap.gameHistoryStatistic.gamesWon / this.heroSnap.gameHistoryStatistic.gamesPlayed;
    this.totalTimeMins = this.heroSnap.gameHistoryStatistic.timePlayed / 60;
    this.timeOnFire = this.combatLifetimeStats ? this.combatLifetimeStats.timeSpentOnFire / 60 : 0;

    this.statsData = [
      {
        title: 'Kills',
        value: this.combatLifetimeStats ? this.combatLifetimeStats.finalBlows / this.totalTimeMins : 0
      }, {
        title: 'Assists',
        value: this.combatLifetimeStats ?
          (this.combatLifetimeStats.offensiveAssists + this.combatLifetimeStats.defensiveAssists) / this.totalTimeMins :
          0
      }, {
        title: 'Damage Done',
        value: this.combatLifetimeStats ? this.combatLifetimeStats.damageDone / this.totalTimeMins : 0
      }, {
        title: 'Damage Blocked',
        value: this.combatLifetimeStats ? this.combatLifetimeStats.damageBlocked / this.totalTimeMins : 0
      }, {
        title: 'Healing Done',
        value: this.combatLifetimeStats ? this.combatLifetimeStats.healingDone / this.totalTimeMins : 0
      }, {
        title: 'Medals',
        value: this.matchAwardsStats ? this.matchAwardsStats.totalMedals / this.totalTimeMins : 0
      }
    ];
  }
}
