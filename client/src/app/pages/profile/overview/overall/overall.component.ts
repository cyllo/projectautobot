import { Component, OnInit, Input } from '@angular/core';
import { ChartData, ChartType } from '../../../../models';
import { add } from 'ramda';

@Component({
  selector: 'ow-overall',
  templateUrl: 'overall.component.html',
  styleUrls: [ 'overall.component.scss' ]
})

export class OverallPerformanceComponent implements OnInit {
  @Input() totalGameAverage: any;
  @Input() matchAwards: any;

  generalChart: ChartData;

  combatChart: ChartData;

  constructor() {}

  ngOnInit() {
    this.generalChart = {
      xAxisLabels: ['Kills', 'Offensive Assists', 'Defensive Assists', 'Total Assists', 'Deaths'],
      datasets: [{
        label: 'General',
        data: [
          this.totalGameAverage.finalBlowsAvgPer10Min,
          this.totalGameAverage.offensiveAssistsAvgPer10Min,
          this.totalGameAverage.defensiveAssistsAvgPer10Min,
          add(this.totalGameAverage.offensiveAssistsAvgPer10Min, this.totalGameAverage.defensiveAssistsAvgPer10Min),
          this.totalGameAverage.deathsAvgPer10Min
        ]
      }],
      chartType: ChartType.polarArea,
      legend: true
    };

    this.combatChart = {
      xAxisLabels: ['Hero Damage', 'Shield Damage', 'Healing', 'Blocked'],
      datasets: [{
        label: 'General',
        data: [
          this.totalGameAverage.heroDamageDoneAvgPer10Min,
          this.totalGameAverage.barrierDamageDoneAvgPer10Min,
          this.totalGameAverage.healingDoneAvgPer10Min,
          this.totalGameAverage.damageBlockedAvgPer10Min
      ]
      }],
      chartType: ChartType.polarArea,
      legend: true
    };
  }

}
