import { Component, Input, OnInit } from '@angular/core';
import { OverwatchHeroDataService } from '../../../services';
import { TransformedStats,
         OverwatchStaticData,
         ChartData,
         ChartDataset,
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

  _snapshotStats: TransformedStats;

  charts: ChartData[] = [];

  /*
  chart: ChartData = {
    xAxisLabels: ['1', '2', '3', '4', '5', '6', '7'],
    datasets: [{
        label: 'Skill Rating',
        data: [200, 200, 200, 200, 200, 200, 200]
    }],
    chartType: ChartType.line,
    legend: false
  };
  */

  private overwatchStaticData: OverwatchStaticData;

  constructor(private owHeroData: OverwatchHeroDataService) {}

  load() {
    console.log(this._snapshotStats);
  }

  ngOnInit() {



    this.owHeroData.data$.subscribe(res => this.overwatchStaticData = res);

    // const { combatLifetimeStatistic, gameHistoryStatistic } = this.snapshotStats;
    // //const timePlayed = gameHistoryStatistic.timePlayed / 60;
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

  addChart(data: ChartData) {
    this.charts.push(data);
  }

}
