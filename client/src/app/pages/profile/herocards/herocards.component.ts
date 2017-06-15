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
  sortedHeroes: Array<any>;

  constructor(private owHeroData: OverwatchHeroDataService) {
    this.owHeroData.data$.subscribe(
      res => this.heroData = res,
      error => console.log(error)
    );
  }

  ngOnInit() {}

  private load() {
    this.reset();

    let ss   = this._snapshotStats;
    let hss  = ss.heroSnapshotStatistics;

    let sort = this.allHeroesByRole.bind(this);

    this.sortedHeroes  = sort(hss, this.heroData);

    console.log('uhhh: ', this.sortedHeroes);
  }

  private reset() {
    this.sortedHeroes = [];
  }

  private allHeroesByRole(hss: HeroSnapshotStats[], heroData: OverwatchStaticData): Array<any> {
    let store: Array<any> = [];
    let sort = this.sortHeroesByTimePlayed;
    let get  = this.getHeroesOfRole;
    let push = this.pushHeroes;

    push('All Heroes', null, sort(hss), store);
    heroData.roles.every(role => {
      push( role.name, role.id, sort( get( hss, role.id ) ), store );
      return true;
    });

    return store;
  }

  private pushHeroes(name: string, id: number, hss: HeroSnapshotStats[], store: Array<any>) {
    store.push({
      roleName: name,
      id: id,
      value: hss
    });
  }

  private sortHeroesByTimePlayed(hss: HeroSnapshotStats[]): HeroSnapshotStats[] {
    return hss.sort(function(a: HeroSnapshotStats, b: HeroSnapshotStats){
      return b.gameHistoryStatistic.timePlayed - a.gameHistoryStatistic.timePlayed;
    });
  }

  private getHeroesOfRole(hss: HeroSnapshotStats[], role: Number): HeroSnapshotStats[] {
    return hss.filter((x) => {
      return x.hero['role'] === role;
    });
  }

}
