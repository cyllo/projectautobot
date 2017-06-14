import { Component, Input, OnInit } from '@angular/core';
import { SnapshotStats, HeroSnapshotStats, OverwatchStaticData } from '../../../models';
import { OverwatchHeroDataService } from '../../../services';

@Component({
  selector: 'ow-most-played',
  templateUrl: 'most-played.component.html',
  styleUrls: [ 'most-played.component.scss' ]
})

export class MostPlayedComponent implements OnInit {
  @Input()
  set snapshotStats(snapshotStats) {
    if (!snapshotStats) { return; }
    this._snapshotStats = snapshotStats;
    this.load();
  }
  get snapshotStats() {
    return this._snapshotStats;
  }

  sortedHeroes: HeroSnapshotStats[];
  private _snapshotStats: SnapshotStats;
  private heroData: OverwatchStaticData;

  constructor(private owHeroData: OverwatchHeroDataService) {
    this.owHeroData.data$.subscribe(
      res => this.heroData = res,
      error => console.log(error)
    );
  }

  ngOnInit() {}

  load () {
    this.resetSortedHeroes();

    let sort = this.sortHeroesByTimePlayed;
    let ss   = this._snapshotStats;
    let hss  = ss.heroSnapshotStatistics;

    const LIST_SIZE = 4;

    this.sortedHeroes = sort(hss.slice()).slice(0, LIST_SIZE);
  }

  resetSortedHeroes() {
    this.sortedHeroes = [];
  }

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
