import { Component, OnInit } from '@angular/core';
import { ChartData, ChartType } from '../../models';

@Component({
  selector: 'ow-compare',
  templateUrl: 'compare.component.html',
  styleUrls: ['compare.component.scss']
})
export class CompareComponent implements OnInit {

  chartData: ChartData = {
      xAxisLabels: ['05-19', '05-20', '05-21', '05-22', '05-23', '05-24', '05-25'],
      datasets: [
        { data: [2300, 2818, 1920, 3498, 4200, 4220, 4786], label: 'You' },
        { data: [1300, 1818, 2400, 1992, 3800, 3890, 4200], label: 'Others' }
      ],
      chartType: ChartType.line,
      legend: false
  };

  statBlocks = [1, 2, 3, 4];

  constructor() {}

  ngOnInit() {}

}
