import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { SnapshotStats, HeroSnapshotStats, CombatLifetimeStats, MatchAwardsStats } from '../../../models';

@Component({
  selector: 'ow-most-played',
  templateUrl: 'most-played.component.html',
  styleUrls: [ 'most-played.component.scss' ]
})

export class MostPlayedComponent implements OnInit, AfterContentInit {
  @Input() snapshotStats: SnapshotStats;
  @Input() owHeroData: any;

  allHeroSnapshotStats: HeroSnapshotStats;
  heroSnapshotStats: HeroSnapshotStats[];
  combatLifetimeStats: CombatLifetimeStats;
  matchAwardsStats: MatchAwardsStats;
  sortedHeroes: HeroSnapshotStats[];


  heroData: any;

  constructor() {}

  ngOnInit() {
    this.allHeroSnapshotStats = this.snapshotStats.allHeroesSnapshotStatistic;
    this.heroSnapshotStats = this.snapshotStats.heroSnapshotStatistics;
    this.combatLifetimeStats = this.allHeroSnapshotStats.combatLifetimeStatistic;
    this.matchAwardsStats = this.allHeroSnapshotStats.matchAwardsStatistic;

    this.heroData = this.owHeroData;
    this.sortedHeroes = this.heroSnapshotStats.slice().sort(function(a: any, b: any) {
      return b.gameHistoryStatistic.timePlayed - a.gameHistoryStatistic.timePlayed;
    });

  }

  ngAfterContentInit() {}

  roleToString(id: any): String {
    return this.heroData.roles.find((x) => {
      return x.id === id;
    }).name;
  }

}
