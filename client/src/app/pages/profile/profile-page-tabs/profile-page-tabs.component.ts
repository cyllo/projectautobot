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

  constructor(private http: Http) {
    this.getRoleData().subscribe(() => {});
  }

  ngAfterContentInit() {
    this.allHeroSnapshotStats = this.snapshotStats.allHeroesSnapshotStatistic;
    this.combatLifetimeStats = this.allHeroSnapshotStats.combatLifetimeStatistic;
    this.matchAwardsStats = this.allHeroSnapshotStats.matchAwardsStatistic;
  }

  getRoleData() {
    return this.http.get(`/lib/overwatch.json`)
      .map(res => res.json());
  }
}
