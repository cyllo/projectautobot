import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { SnapshotStats, HeroSnapshotStats, CombatLifetimeStats, MatchAwardsStats } from '../../../models';

@Component({
  selector: 'ow-most-played',
  templateUrl: 'most-played.component.html',
  styleUrls: [ 'most-played.component.scss' ]
})

export class MostPlayedComponent implements OnInit, AfterContentInit {
  @Input() owHeroData: any;
  _snapshotStats: SnapshotStats;
  allHeroSnapshotStats: HeroSnapshotStats;
  heroSnapshotStats: HeroSnapshotStats[];
  combatLifetimeStats: CombatLifetimeStats;
  matchAwardsStats: MatchAwardsStats;
  sortedHeroes: HeroSnapshotStats[];
  heroData: any;

  constructor() {}

  @Input()
  set snapshotStats(snapshotStats) {
    if (!snapshotStats) {
      return;
    }

    this._snapshotStats = snapshotStats;
    this.allHeroSnapshotStats = this._snapshotStats.allHeroesSnapshotStatistic;
    this.heroSnapshotStats = this._snapshotStats.heroSnapshotStatistics;
    this.combatLifetimeStats = this.allHeroSnapshotStats.combatLifetimeStatistic;
    this.matchAwardsStats = this.allHeroSnapshotStats.matchAwardsStatistic;
    this.heroData = this.owHeroData;

    this.sortedHeroes = this.heroSnapshotStats.slice().sort(function(a: any, b: any) {
      return b.gameHistoryStatistic.timePlayed - a.gameHistoryStatistic.timePlayed;
    });
  }

  get snapshotStats() {
    return this._snapshotStats;
  }

  ngOnInit() {
    this.allHeroSnapshotStats = this.snapshotStats.allHeroesSnapshotStatistic;
    this.heroSnapshotStats = this.snapshotStats.heroSnapshotStatistics;
    this.combatLifetimeStats = this.allHeroSnapshotStats.combatLifetimeStatistic;
    this.matchAwardsStats = this.allHeroSnapshotStats.matchAwardsStatistic;

    this.heroData = this.owHeroData;
    this.sortedHeroes = this.sortHeroesByTimePlayed(this.heroSnapshotStats.slice());

  }

  ngAfterContentInit() {}

  sortHeroesByTimePlayed(i: any) {
    return i.sort(function(a: any, b: any) {
      return b.gameHistoryStatistic.timePlayed - a.gameHistoryStatistic.timePlayed;
    });
  }

  getRoleIcon(id: any) {
    return this.heroData.roles.find((x) => {
      return x.id === id;
    }).iconUrl;
  }

  roleToString(id: any): String {
    return this.heroData.roles.find((x) => {
      return x.id === id;
    }).name;
  }

}
