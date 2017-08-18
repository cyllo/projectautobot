import { Component, OnInit } from '@angular/core';
import { ChartData, ChartType } from '../../../models';

@Component({
  selector: 'ow-skill-rating-trend',
  templateUrl: 'skill-rating-trend.component.html',
  styleUrls: [ 'skill-rating-trend.component.scss' ]
})

export class SkillRatingTrendComponent implements OnInit {

  chart: ChartData = {
    xAxisLabels: ['1', '2', '3', '4', '5', '6', '7'],
    datasets: [{
        label: 'Skill Rating',
        data: [200, 200, 200, 200, 200, 200, 200]
    }],
    chartType: ChartType.line,
    legend: false
  };

  constructor() {}

  ngOnInit() {}

}
