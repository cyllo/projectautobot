import { Component, Input, OnInit } from '@angular/core';
import { OverwatchHeroDataService } from '../../../services';
import { TransformedStats,
         OverwatchStaticData,
         ChartData,
         ChartType } from '../../../models';

@Component({
  selector: 'ow-career',
  templateUrl: 'career.component.html',
  styleUrls: [ 'career.component.scss' ]
})

export class CareerComponent implements OnInit {
  @Input('snapshotStats')
  get snapshotStats(): TransformedStats {
    return this._snapshotStats;
  }
  set snapshotStats(snapshotStats: TransformedStats) {
    this._snapshotStats = snapshotStats;
    this.load();
  }

  private _snapshotStats: TransformedStats;
  private overwatchStaticData: OverwatchStaticData;

  combatChart: ChartData;
  gameChart: ChartData;

  constructor(private owHeroData: OverwatchHeroDataService) {}

  load() {
    console.log(this._snapshotStats);
    const { combatLifetimeStatistic, gameHistoryStatistic } = this.snapshotStats.heroesTotalSnapshotStatistic;
    const timePlayed = gameHistoryStatistic.timePlayed / 60;

    this.combatChart = {
      xAxisLabels: ['Eliminations', 'Kills', 'Deaths', 'Damage'],
      datasets:
      [{
        label: 'Combat Performance',
        data:
        [
          combatLifetimeStatistic.eliminations / timePlayed,
          combatLifetimeStatistic.finalBlows / timePlayed,
          combatLifetimeStatistic.deaths / timePlayed,
          combatLifetimeStatistic.damageDone / timePlayed
        ]
      }],
      chartType: ChartType.polarArea,
      legend: true
    };

    this.gameChart = {
      xAxisLabels: ['Blocked', 'Healing', 'Assists'],
      datasets:
      [{
        label: 'Supporting Performance',
        data:
        [
          combatLifetimeStatistic.damageBlocked / timePlayed,
          combatLifetimeStatistic.healingDone / timePlayed,
          (combatLifetimeStatistic.offensiveAssists + combatLifetimeStatistic.defensiveAssists) / timePlayed
        ]
      }],
      chartType: ChartType.polarArea,
      legend: true
    };

  }

  ngOnInit() {



    this.owHeroData.data$.subscribe(res => this.overwatchStaticData = res);

    //
    // //
    //
    // const combatChart = {
    //   xAxisLabels: ['Eliminations', 'K/D Ratio', 'Damage'],
    //   datasets:
    //   [{
    //     label: 'Combat Performance',
    //     data:
    //     [
    //       combatLifetimeStatistic.Eliminations
    //     ]
    //   }]
    // };

  }

}
