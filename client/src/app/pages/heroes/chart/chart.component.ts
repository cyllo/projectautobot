import { Component, OnInit } from '@angular/core';
import { ChartType } from '../../../models';

@Component({
  selector: 'ow-heroes-chart',
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.scss']
})
export class HeroesChartComponent implements OnInit {

  // Skill Rating Distribution Chart
  srdChart = {
    xAxisLabels: ['Mercy', 'Soldier-76', 'Reinhardt', 'Lucio'],
    datasets:
    [
      {
        label: 'Play time per competitive rank',
        data: [1, 2, 3, 4]
      }
    ],
    chartType: ChartType.bar,
    legend: false
  };

  constructor() {}

  ngOnInit() {}

}
