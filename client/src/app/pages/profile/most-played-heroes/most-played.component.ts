import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { SnapshotStats, HeroSnapshotStats } from '../../../models';
import { OverwatchStaticData } from '../../../models';

@Component({
  selector: 'ow-most-played',
  templateUrl: 'most-played.component.html',
  styleUrls: [ 'most-played.component.scss' ]
})

export class MostPlayedComponent implements OnInit, AfterContentInit {
  @Input() owHeroData: OverwatchStaticData;
  _snapshotStats: SnapshotStats;
  sortedHeroes: HeroSnapshotStats[];
  heroData: OverwatchStaticData;

  constructor() {}

  @Input()
  set snapshotStats(snapshotStats) {
    if (!snapshotStats) {
      return;
    }
    this._snapshotStats = snapshotStats;
  }

  get snapshotStats() {
    return this._snapshotStats;
  }

  ngOnInit() {
    this.heroData = this.owHeroData;
    this.sortedHeroes = this.sortHeroesByTimePlayed(this._snapshotStats.heroSnapshotStatistics.slice());
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
