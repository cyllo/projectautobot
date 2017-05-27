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

  private owJsonData: any;

  constructor(private http: Http) {
    this.getRoleData().subscribe(
      value => this.owJsonData = value,
      error => console.log(error),
      () => {
        console.log(this.owJsonData);
        let x = this.snapshotStats.heroSnapshotStatistics.map(function(currentValue, index, arr){
          //console.log(this.owJsonData.find(currentValue.hero.code));
          console.log(currentValue, index, arr);
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
