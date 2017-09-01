import { Component, OnInit } from '@angular/core';
import { ChartType } from '../../../models';

@Component({
  selector: 'ow-leaderboard-chart',
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.scss']
})
export class LeaderboardChartComponent implements OnInit {

  // Skill Rating Distribution Chart
  srdChart = {
    xAxisLabels: ['0', '500', '1000', '1500'],
    datasets:
    [
      {
        label: 'Skill Rating Distribution',
        data: [1, 2, 3, 4]
      }
    ],
    chartType: ChartType.bar,
    legend: false
  };

  constructor() {}

  ngOnInit() {}

}
