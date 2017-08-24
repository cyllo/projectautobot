import { Component, Input, OnInit } from '@angular/core';
import { TransformedStats, OverwatchStaticData } from '../../../models';
import { OverwatchHeroDataService } from '../../../services';
import { sort, map, slice } from 'ramda';

@Component({
  selector: 'ow-most-played',
  templateUrl: 'most-played.component.html',
  styleUrls: ['most-played.component.scss']
})

export class MostPlayedComponent implements OnInit {
  @Input()
  get snapshotStats(): TransformedStats {
    return this._snapshotStats;
  }
  set snapshotStats(snapshotStats: TransformedStats) {
    if (!snapshotStats) { return; }
    this._snapshotStats = snapshotStats;
    this.load();
  }

  sortedHeroData: any[] = [];
  private _snapshotStats: TransformedStats;
  heroData: OverwatchStaticData;

  constructor(private owHeroDataService: OverwatchHeroDataService) {
    this.owHeroDataService.data$.subscribe(
      res => this.heroData = res,
      error => console.log(error)
    );
  }

  ngOnInit() {}

  private load() {
    const sorted = slice(0, 5, this.sortheroes(this.snapshotStats));
    this.sortedHeroData = map((heroSnap) => {
      const { combatLifetimeStatistic, gameHistoryStatistic } = heroSnap;
      if (heroSnap.hero) {
        return {
          name: heroSnap.hero.name,
          portraitUrl: heroSnap.hero.portraitUrl,
          role: this.roleToString(heroSnap.hero.role),
          kills: combatLifetimeStatistic.finalBlows,
          deaths: combatLifetimeStatistic.deaths,
          kdratio: combatLifetimeStatistic.finalBlows / combatLifetimeStatistic.deaths,
          wins: gameHistoryStatistic.gamesWon,
          winRate: gameHistoryStatistic.winPercentage,
        };
      }
      return null;
    }, sorted);
  }

  sortheroes(snapshotStats) {
    return sort((a: any, b: any) =>
      b.gameHistoryStatistic.timePlayed - a.gameHistoryStatistic.timePlayed,
      snapshotStats.heroSnapshotStatistics
    );
  }

  roleToString(id: number): string {
    return this.heroData.roles.find((x) => {
      return x.id === id;
    }).name;
  }

}
