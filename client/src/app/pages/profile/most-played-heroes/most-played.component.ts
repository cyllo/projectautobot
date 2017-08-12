import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { TransformedStats, HeroSnapshotStats, GameHistoryStats, CombatLifetimeStats, OverwatchStaticData } from '../../../models';
import { Subscription } from 'rxjs/Subscription';

import { OverwatchHeroDataService } from '../../../services';

@Component({
  selector: 'ow-most-played',
  templateUrl: 'most-played.component.html',
  styleUrls: ['most-played.component.scss']
})

export class MostPlayedComponent implements OnInit, OnDestroy {
  @Input()
  set snapshotStats(snapshotStats) {
    if (!snapshotStats) { return; }
    this._snapshotStats = snapshotStats;
    this.load();
  }
  get snapshotStats() {
    return this._snapshotStats;
  }

  sortedHeroData: any[];
  private _snapshotStats: TransformedStats;
  private heroData: OverwatchStaticData;
  private sub: Subscription;

  constructor(private owHeroData: OverwatchHeroDataService) {
    this.sub = this.owHeroData.data$.subscribe(
      res => this.heroData = res,
      error => console.log(error)
    );
  }

  ngOnInit() { }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private load() {
    this.reset();

    let sort = this.sortHeroesByTimePlayed;
    let ss:   TransformedStats    = this._snapshotStats;
    let hss:  HeroSnapshotStats[] = ss.heroSnapshotStatistics;
    let htss: HeroSnapshotStats   = ss.heroesTotalSnapshotStatistic;
    let ghs:  GameHistoryStats    = htss.gameHistoryStatistic;

    let timeplayed: number = ghs.timePlayed;

    this.createHeroData(sort(hss).slice(0, 4), timeplayed);
  }

  private reset() {
    this.sortedHeroData = [];
  }

  private createHeroData(hss: HeroSnapshotStats[], totalTimePlayed: number): void {
    hss.every((e) => {

      let cls: CombatLifetimeStats = e.combatLifetimeStatistic;
      let ghs: GameHistoryStats    = e.gameHistoryStatistic;

      let heroName   = e.hero.name;
      let heroId     = e.hero['role'];
      let heroCode   = e.hero.code;
      let heroRole   = this.roleToString(heroId);

      let kills       = cls.finalBlows;
      let deaths      = cls.deaths;
      let wins        = ghs.gamesWon;
      let loss        = ghs.gamesLost;
      let gamesPlayed = ghs.gamesPlayed;
      let timePlayed  = ghs.timePlayed;

      let amountPlayed = Math.round( (timePlayed / totalTimePlayed) * 100 );

      let data: any[] = [
        {
          name: 'Kills',
          value: kills
        },
        {
          name: 'Deaths',
          value: deaths
        },
        {
          name: 'K/D Ratio',
          value: Number((kills / deaths).toFixed(2))
        },
        {
          name: 'Wins',
          value: wins
        },
        {
          name: 'Losses',
          value: loss
        },
        {
          name: 'Games Played',
          value: gamesPlayed
        },
        {
          name: 'Time Played',
          value: timePlayed / 60
        }
      ];

      this.sortedHeroData.push({
        name: heroName,
        icon: this.iconUrl(heroId),
        code: heroCode,
        role: heroRole,
        amountPlayed: amountPlayed,
        data: data
      });

      return true;
    });
  }

  private sortHeroesByTimePlayed(heroes: HeroSnapshotStats[]) {
    return heroes.sort((heroA: HeroSnapshotStats, heroB: HeroSnapshotStats) => {
      return heroB.gameHistoryStatistic.timePlayed - heroA.gameHistoryStatistic.timePlayed;
    });
  }

  iconUrl(id: number): string {
    if (!id) {
      return null;
    }

    return this.heroData.roles.find((x) => {
      return x.id === id;
    }).iconUrl;
  }

  roleToString(id: number): string {
    return this.heroData.roles.find((x) => {
      return x.id === id;
    }).name;
  }
}
