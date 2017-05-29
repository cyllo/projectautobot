import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, CombatLifetimeStats, HeroSnapshotStats, MatchAwardsStats } from '../../models';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';

@Component({
  selector: 'ow-hero-card',
  templateUrl: 'hero-card.component.html',
  styleUrls: [ 'hero-card.component.scss' ]
})

export class HeroCardComponent implements OnInit {
  @Input() heroSnap: HeroSnapshotStats;
  state$: Observable<AppState>;
  combatLifetimeStats: CombatLifetimeStats;
  matchAwardsStats: MatchAwardsStats;
  statsData;
  winRate: number;
  totalTimeMins: number;
  timeOnFire: number;
  heroPlayedPercentage: number;
  totalTimePlayed: number;
  gamesPlayed: number;

  heroData: JSON;

  constructor(private store: Store<AppState>, private http: Http) {
    this.state$ = this.store.select(state => state);
    this.state$.subscribe(s => {
      let tag = Object.keys(s.players);
      const snapStats = s.players[tag[0]].snapshotStatistics[s.players[tag[0]].snapshotStatistics.length - 1];

      this.totalTimePlayed = snapStats.allHeroesSnapshotStatistic.gameHistoryStatistic.timePlayed;
      this.gamesPlayed = snapStats.allHeroesSnapshotStatistic.gameHistoryStatistic.gamesPlayed;
    });
  }

  ngOnInit() {

    this.getOverwatchHeroData().subscribe(
      res => this.heroData = res,
      error => console.log(error)
    );

    this.combatLifetimeStats = this.heroSnap.combatLifetimeStatistic;
    this.matchAwardsStats = this.heroSnap.matchAwardsStatistic;
    this.winRate = this.heroSnap.gameHistoryStatistic.gamesWon / this.heroSnap.gameHistoryStatistic.gamesPlayed * 100;
    this.totalTimeMins = this.heroSnap.gameHistoryStatistic.timePlayed / 60;
    this.timeOnFire = this.combatLifetimeStats ? this.combatLifetimeStats.timeSpentOnFire / 60 : 0;
    this.heroPlayedPercentage = (this.heroSnap.gameHistoryStatistic.timePlayed / this.totalTimePlayed) * 100;

    this.statsData = [
      {
        title: 'Kills',
        value: this.combatLifetimeStats ? this.combatLifetimeStats.finalBlows / this.totalTimeMins : 0
      }, {
        title: 'Assists',
        value: this.combatLifetimeStats ?
          (this.combatLifetimeStats.offensiveAssists + this.combatLifetimeStats.defensiveAssists) / this.totalTimeMins :
          0
      }, {
        title: 'Damage Done',
        value: this.combatLifetimeStats ? this.combatLifetimeStats.damageDone / this.totalTimeMins : 0
      }, {
        title: 'Damage Blocked',
        value: this.combatLifetimeStats ? this.combatLifetimeStats.damageBlocked / this.totalTimeMins : 0
      }, {
        title: 'Healing Done',
        value: this.combatLifetimeStats ? this.combatLifetimeStats.healingDone / this.totalTimeMins : 0
      }, {
        title: 'Medals',
        value: this.matchAwardsStats ? this.matchAwardsStats.totalMedals / this.totalTimeMins : 0
      }
    ];
  }

  getOverwatchHeroData() {
    return this.http.get('/lib/overwatch.json')
      .map(res => res.json());
  }

  roleToString(role){
    return this.heroData['roles'][role];
  }

}
