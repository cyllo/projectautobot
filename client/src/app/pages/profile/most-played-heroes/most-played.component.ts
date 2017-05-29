import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { SnapshotStats, HeroSnapshotStats, CombatLifetimeStats, MatchAwardsStats } from '../../../models';

@Component({
  selector: 'ow-most-played',
  templateUrl: 'most-played.component.html',
  styleUrls: [ 'most-played.component.scss' ]
})

export class MostPlayedComponent implements OnInit, AfterContentInit {
  @Input() snapshotStats: SnapshotStats;
  allHeroSnapshotStats: HeroSnapshotStats;
  heroSnapshotStats: HeroSnapshotStats[];
  combatLifetimeStats: CombatLifetimeStats;
  matchAwardsStats: MatchAwardsStats;
  sortedHeroes: HeroSnapshotStats[];

  heroData: JSON;

  constructor(private http: Http) {}

  ngOnInit() {

    this.getOverwatchHeroData().subscribe(
      res => this.heroData = res,
      error => console.log(error)
    );

    this.allHeroSnapshotStats = this.snapshotStats.allHeroesSnapshotStatistic;
    this.heroSnapshotStats = this.snapshotStats.heroSnapshotStatistics;
    this.combatLifetimeStats = this.allHeroSnapshotStats.combatLifetimeStatistic;
    this.matchAwardsStats = this.allHeroSnapshotStats.matchAwardsStatistic;
  }

  ngAfterContentInit() {
    this.sortedHeroes = this.heroSnapshotStats.slice().sort(function(a: any, b: any) {
      return b.gameHistoryStatistic.timePlayed - a.gameHistoryStatistic.timePlayed;
    });
  }

  getOverwatchHeroData() {
    return this.http.get('/lib/overwatch.json')
      .map(res => res.json());
  }

  roleToString(role){
    return this.heroData['roles'][role];
  }


}
