import { Component } from '@angular/core';

@Component({
  selector: 'ow-hero-career',
  templateUrl: 'hero-career.component.html',
  styleUrls: ['hero-career.component.scss']
})
export class HeroCareerComponent {

  public chartdatasets: Array<any> = [
    {
      chartTitle: 'Kills',
      xAxisLabels: ['05-19', '05-20', '05-21', '05-22', '05-23', '05-24', '05-25'],
      datasets: [
        { data: [2300, 2818, 1920, 3498, 4200, 4220, 4786], label: 'You' },
        { data: [1300, 1818, 2400, 1992, 3800, 3890, 4200], label: 'Others' }
      ]
    },
    {
      chartTitle: 'Assists',
      xAxisLabels: ['05-19', '05-20', '05-21', '05-22', '05-23', '05-24', '05-25'],
      datasets: [
        { data: [2300, 2218, 1920, 1498, 4200, 4220, 2786], label: 'You' },
        { data: [1300, 1818, 2400, 1992, 3600, 3590, 4200], label: 'Others' }
      ]
    },
    {
      chartTitle: 'K/D Ratio',
      xAxisLabels: ['05-19', '05-20', '05-21', '05-22', '05-23', '05-24', '05-25'],
      datasets: [
        { data: [1300, 2318, 1590, 3498, 2200, 3220, 3786], label: 'You' },
        { data: [2300, 1518, 2300, 1992, 3800, 3890, 3200], label: 'Others' }
      ]
    }
  ];

  constructor() { }

}
