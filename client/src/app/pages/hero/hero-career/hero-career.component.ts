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
      datasets: [
        { data: [2300, 2818, 1920, 3498, 4200, 4220, 4786], label: 'You' },
        { data: [1300, 1818, 2400, 1992, 3800, 3890, 4200], label: 'Others' }
      ]
    },
    {
      chartTitle: 'Assists',
      datasets: [
        { data: [2300, 2818, 1920, 3498, 4200, 4220, 4786], label: 'You' },
        { data: [1300, 1818, 2400, 1992, 3800, 3890, 4200], label: 'Others' }
      ]
    },
    {
      chartTitle: 'K/D Ratio',
      datasets: [
        { data: [2300, 2818, 1920, 3498, 4200, 4220, 4786], label: 'You' },
        { data: [1300, 1818, 2400, 1992, 3800, 3890, 4200], label: 'Others' }
      ]
    }
  ];

  constructor() { }

}
