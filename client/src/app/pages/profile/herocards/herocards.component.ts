import { Component, Input, OnInit } from '@angular/core';
import { SnapshotStats, HeroSnapshotStats, OverwatchStaticData } from '../../../models';
import { OverwatchHeroDataService } from '../../../services';

@Component({
  selector: 'ow-hero-cards',
  templateUrl: 'herocards.component.html',
  styleUrls: [ 'herocards.component.scss' ]
})

export class HeroCardsComponent implements OnInit {
  @Input()
  set snapshotStats(snapshotStats) {
    if (!snapshotStats) { return; }
    this._snapshotStats = snapshotStats;
    this.load();
  }
  get snapshotStats() {
    return this._snapshotStats;
  }

  private _snapshotStats: SnapshotStats;
  private heroData: OverwatchStaticData;
  sortedHeroes: HeroSnapshotStats[];

  constructor(private owHeroData: OverwatchHeroDataService) {
    this.owHeroData.data$.subscribe(
      res => this.heroData = res,
      error => console.log(error)
    );
  }

  ngOnInit() {}

  load() {
    this.resetSortedHeroes();

    let ss   = this._snapshotStats;
    let hss  = ss.heroSnapshotStatistics;

    let sort = this.allHeroesByRole.bind(this);

    this.sortedHeroes  = sort(hss, this.heroData);
  }

  resetSortedHeroes() {
    this.sortedHeroes = [];
  }

  allHeroesByRole(hss: HeroSnapshotStats[], heroData: OverwatchStaticData) {
    let data: Array<any> = [];
    let sort = this.sortHeroesByTimePlayed;
    let get  = this.getHeroesOfRole;

    data.push(sort(hss));
    heroData.roles.every(role => {
      data.push( sort( get(hss, role.id) ) );
      return true;
    });

    return data;
  }

  sortHeroesByTimePlayed(hss: HeroSnapshotStats[]): HeroSnapshotStats[] {
    return hss.sort(function(a: HeroSnapshotStats, b: HeroSnapshotStats){
      return b.gameHistoryStatistic.timePlayed - a.gameHistoryStatistic.timePlayed;
    });
  }

  getHeroesOfRole(hss: HeroSnapshotStats[], role: Number): HeroSnapshotStats[] {
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
