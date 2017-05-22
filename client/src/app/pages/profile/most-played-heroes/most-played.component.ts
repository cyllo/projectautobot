import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { Player, SnapshotStats, HeroSnapshotStats, CombatLifetimeStats, MatchAwardsStats } from '../../../models';

@Component({
  selector: 'ow-most-played',
  templateUrl: 'most-played.component.html',
  styleUrls: [ 'most-played.component.scss' ]
})

export class MostPlayedComponent implements OnInit, AfterContentInit {
  @Input() player: Player;
  snapshotStats: SnapshotStats;
  allHeroSnapshotStats: HeroSnapshotStats;
  heroSnapshotStats: HeroSnapshotStats[];
  combatLifetimeStats: CombatLifetimeStats;
  matchAwardsStats: MatchAwardsStats;
  sortedHeroes: HeroSnapshotStats[];

  constructor() {}

  ngOnInit() {
    this.snapshotStats = this.player.snapshotStatistics[this.player.snapshotStatistics.length - 1];
    this.allHeroSnapshotStats = this.snapshotStats.allHeroesSnapshotStatistic;
    this.heroSnapshotStats = this.snapshotStats.heroSnapshotStatistics;
    this.combatLifetimeStats = this.allHeroSnapshotStats.combatLifetimeStatistic;
    this.matchAwardsStats = this.allHeroSnapshotStats.matchAwardsStatistic;
  }

  ngAfterContentInit() {
    // create a copy of the array and sort it by timeplayed (high > low )
    this.sortedHeroes = this.heroSnapshotStats.slice().sort(function(a: HeroSnapshotStats, b: HeroSnapshotStats){
      if( a.gameHistoryStatistic.timePlayed > b.gameHistoryStatistic.timePlayed ){
        return -1;
      } else if ( a.gameHistoryStatistic.timePlayed < b.gameHistoryStatistic.timePlayed ) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}
