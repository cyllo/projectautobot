import { Component } from '@angular/core';

@Component({
  selector: 'ow-hero-trends',
  templateUrl: 'trends.component.html',
  styleUrls: ['trends.component.scss']
})

export class HeroTrendsComponent {

  derp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // options
  showXAxis = true;
  showYAxis = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Eliminations';
  showYAxisLabel = false;
  yAxisLabel = 'value';
  autoScale = true;

  data = [
    {
      'name': 'Eliminations',
      'series': [
        {
          'name': '01-01',
          'value': 10
        },
        {
          'name': '01-02',
          'value': 15
        },
        {
          'name': '01-03',
          'value': 13
        },
        {
          'name': '01-04',
          'value': 13
        },
        {
          'name': '01-05',
          'value': 13
        },
        {
          'name': '01-06',
          'value': 13
        },
        {
          'name': '01-07',
          'value': 13
        }
      ]
    }
  ];

  constructor() {}

  onSelect(event) {
    console.log(event);
  }

}
