import { Component, Input, OnInit } from '@angular/core';
import { SnapshotStats, HeroSnapshotStats, OverwatchStaticData } from '../../../models';

@Component({
  selector: 'ow-hero-cards',
  templateUrl: 'herocards.component.html',
  styleUrls: [ 'herocards.component.scss' ]
})

export class HeroCardsComponent implements OnInit {
  @Input() owHeroData: any;

  _snapshotStats: SnapshotStats;
  heroData: OverwatchStaticData;
  allHeroesSnapshot: HeroSnapshotStats;
  heroesByRoles: any[];

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

  constructor() {}

  ngOnInit() {
    this.heroData = this.owHeroData;
    this.allHeroesSnapshot = this._snapshotStats.allHeroesSnapshotStatistic;
    this.heroesByRoles = this.allHeroesByRole(this._snapshotStats.heroSnapshotStatistics);
  }

  allHeroesByRole(hss: any) {
    let data: any[] = [];
    data.push(this.sortHeroesByTimePlayed(hss));
    this.heroData.roles.forEach((role) => {
      data.push(this.sortHeroesByTimePlayed(this.getHeroesOfRole(hss, role.id)));
    });
    return data;
  }

  sortHeroesByTimePlayed(i: any) {
    return i.sort(function(a: any, b: any){
      return b.gameHistoryStatistic.timePlayed - a.gameHistoryStatistic.timePlayed;
    });
  }

  getHeroesOfRole(hss: HeroSnapshotStats[], role: Number) {
    return hss.filter((x) => {
      return x.hero['role'] === role;
    });
  }

  roleToString(id: number): String {
    if (id < 0) {
      return String('All Heroes');
    } else {
      return this.heroData['roles'].find((x) => {
        return x.id === id;
      }).name;
    }
  }

}
