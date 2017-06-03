import { Component, Input } from '@angular/core';
import { SnapshotStats, HeroSnapshotStats, CombatLifetimeStats, MatchAwardsStats } from '../../../models';

@Component({
  selector: 'ow-hero-cards',
  templateUrl: 'herocards.component.html',
  styleUrls: [ 'herocards.component.scss' ]
})

export class HeroCardsComponent {
  @Input() owHeroData: any;
  _snapshotStats: SnapshotStats;
  allHeroSnapshotStats: HeroSnapshotStats;
  heroSnapshotStats: HeroSnapshotStats[];
  combatLifetimeStats: CombatLifetimeStats;
  matchAwardsStats: MatchAwardsStats;
  heroData: any;
  public heroesByRoles: any[];

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

    this.heroesByRoles = this.allHeroesByRole();
  }

  get snapshotStats() {
    return this._snapshotStats;
  }

  allHeroesByRole(){
    let data: any[] = [];
    data.push(this.sortHeroesByTimePlayed(this.heroSnapshotStats));
    this.heroData.roles.forEach((role) => {
      data.push(this.sortHeroesByTimePlayed(this.getHeroesOfRole(role.id)));
    });
    return data;
  }

  sortHeroesByTimePlayed(i: any){
    return i.sort(function(a: any, b: any){
      return b.gameHistoryStatistic.timePlayed - a.gameHistoryStatistic.timePlayed;
    });
  }

  getHeroesOfRole(id: number) {
    return this.heroSnapshotStats.filter((x) => {
      return x.hero['role'] === id;
    });
  }

  roleToString(id: number): String {
    if(id < 0) {
      return 'All Heroes';
    } else {
      return this.heroData['roles'].find((x) => {
        return x.id === id;
      }).name;
    }
  }

}
