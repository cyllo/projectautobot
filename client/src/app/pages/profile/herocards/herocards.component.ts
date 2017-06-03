import { OnInit, AfterContentInit, Component, Input } from '@angular/core';
import { SnapshotStats, HeroSnapshotStats, CombatLifetimeStats, MatchAwardsStats } from '../../../models';

@Component({
  selector: 'ow-hero-cards',
  templateUrl: 'herocards.component.html',
  styleUrls: [ 'herocards.component.scss' ]
})

export class HeroCardsComponent implements OnInit, AfterContentInit {
  @Input() snapshotStats: SnapshotStats;
  @Input() owHeroData: any;

  heroData: any;

  allHeroSnapshotStats: HeroSnapshotStats;
  heroSnapshotStats: HeroSnapshotStats[];
  combatLifetimeStats: CombatLifetimeStats;
  matchAwardsStats: MatchAwardsStats;

  public heroesByRoles: any[];

  constructor() {}

  ngOnInit() {
    this.heroData = this.owHeroData;
    this.allHeroSnapshotStats = this.snapshotStats.allHeroesSnapshotStatistic;
    this.heroSnapshotStats = this.snapshotStats.heroSnapshotStatistics;
    this.combatLifetimeStats = this.allHeroSnapshotStats.combatLifetimeStatistic;
    this.matchAwardsStats = this.allHeroSnapshotStats.matchAwardsStatistic;
    this.heroesByRoles = this.allHeroesByRole();
    console.log("X: " , this.heroesByRoles);
  }

  ngAfterContentInit() {}

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
