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

  private load () {
    this.reset();

    let sort = this.sortHeroesByTimePlayed;
    let ss: SnapshotStats         = this._snapshotStats;
    let hss: HeroSnapshotStats[]  = ss.heroSnapshotStatistics;

    const LIST_SIZE = 4;

    this.sortedHeroes = sort(hss).slice(0, LIST_SIZE);
  }

  private reset() {
    this.sortedHeroes = [];
  }

  private sortHeroesByTimePlayed(heroes: HeroSnapshotStats[]) {
    return heroes.sort((heroA: HeroSnapshotStats, heroB: HeroSnapshotStats) => {
      return heroB.gameHistoryStatistic.timePlayed - heroA.gameHistoryStatistic.timePlayed;
    });
  }

  iconUrl(id: number): string {
    return this.heroData.roles.find((x) => {
      return x.id === id;
    }).iconUrl;
  }

  roleToString(id: number): string {
    return this.heroData.roles.find((x) => {
      return x.id === id;
    }).name;
  }
}
