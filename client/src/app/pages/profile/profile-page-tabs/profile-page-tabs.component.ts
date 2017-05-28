import { AfterContentInit, Component, Input } from '@angular/core';
import { SnapshotStats, HeroSnapshotStats, CombatLifetimeStats, MatchAwardsStats } from '../../../models';
import { Http } from '@angular/http';

@Component({
  selector: 'ow-profile-page-tabs',
  templateUrl: 'profile-page-tabs.component.html',
  styleUrls: ['profile-page-tabs.component.scss']
})

export class ProfilePageTabsComponent implements AfterContentInit {
  @Input() snapshotStats: SnapshotStats;
  allHeroSnapshotStats: HeroSnapshotStats;
  combatLifetimeStats: CombatLifetimeStats;
  matchAwardsStats: MatchAwardsStats;

  private owHeroData: any;

  constructor(private http: Http) {
    this.getRoleData().subscribe(
      value => this.owHeroData = value,
      error => console.log(error),
      () => {
        let x = this.snapshotStats.heroSnapshotStatistics.map((val) => {
          return Object.assign({}, val).hero = 
            this.owHeroData.heroes.find((e) => { 
              return e.code === val.hero.code });
        });
        console.log(x);
      }
    );
  }

  ngAfterContentInit() {
    this.allHeroSnapshotStats = this.snapshotStats.allHeroesSnapshotStatistic;
    this.combatLifetimeStats = this.allHeroSnapshotStats.combatLifetimeStatistic;
    this.matchAwardsStats = this.allHeroSnapshotStats.matchAwardsStatistic;
    //console.log("hero snapshot: ", this.snapshotStats);
  }

  getRoleData() {
    return this.http.get(`/lib/overwatch.json`)
      .map(res => res.json());
  }
}
