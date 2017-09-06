import { Component, OnInit, Input } from '@angular/core';
import { ChartData, ChartType } from '../../../../models';

@Component({
  selector: 'ow-overall',
  templateUrl: 'overall.component.html',
  styleUrls: [ 'overall.component.scss' ]
})

export class OverallPerformanceComponent implements OnInit {
  @Input() heroTotalAverageStatistics: any;
  generalChart: ChartData = {
    xAxisLabels: ['Kills', 'Assists', 'Deaths'],
    datasets: [{
        label: 'General',
        data: [200, 200, 200]
    }],
    chartType: ChartType.polarArea,
    legend: true
  };

  combatChart: ChartData = {
    xAxisLabels: ['Hero Damage', 'Shield Damage', 'Healing', 'Blocked'],
    datasets: [{
        label: 'General',
        data: [200, 200, 200, 200]
    }],
    chartType: ChartType.polarArea,
    legend: true
  };

  stats = [
    {
      name: 'Eliminations',
      value: '0.86'
    },
    {
      name: 'K/D Ratio',
      value: '1.86:1'
    },
    {
      name: 'Damage Done',
      value: '2.42'
    },
    {
      name: 'Damage Blocked',
      value: '0.86'
    },
    {
      name: 'Healing Done',
      value: '0.86'
    },
    {
      name: 'Medals',
      value: '0.86'
    }
  ];

  constructor() {}

  ngOnInit() {}

}
