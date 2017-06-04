import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-compare-chart-category',
  templateUrl: 'compare-chart-category.component.html',
  styleUrls: ['compare-chart-category.component.scss']
})
export class CompareChartCategoryComponent implements OnInit {

    public chartdatasets: Array<any> = [
    {
      chartTitle: 'Comparing statistics',
      xAxisLabels: ['05-19', '05-20', '05-21', '05-22', '05-23', '05-24', '05-25'],
      datasets: [
        { data: [2300, 2818, 1920, 3498, 4200, 4220, 4786], label: 'cyllo#2112' },
        { data: [1300, 1818, 2400, 1992, 3800, 3890, 4200], label: 'seagull#1894' },
        { data: [1600, 2518, 1420, 2498, 3200, 3220, 1786], label: 'shayed#1758' }
      ]
    }
  ];

  constructor() {}

  ngOnInit() {}

}
