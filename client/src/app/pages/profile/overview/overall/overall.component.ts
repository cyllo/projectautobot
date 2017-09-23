import { Component, OnInit, Input } from '@angular/core';
import { add } from 'ramda';

@Component({
  selector: 'ow-overall',
  templateUrl: 'overall.component.html',
  styleUrls: [ 'overall.component.scss' ]
})

export class OverallPerformanceComponent implements OnInit {
  @Input() totalGameAverage: any;
  @Input() matchAwards: any;

  showXAxis = true;
  showYAxis = true;
  autoScale = true;
  legend: true;

  generalChart: any[];

  combatChart: any[];

  constructor() {}

  ngOnInit() {
    const totalAssists = add(this.totalGameAverage.offensiveAssistsAvgPer10Min, this.totalGameAverage.defensiveAssistsAvgPer10Min);
    this.generalChart = [{
        name: 'General',
        series: [
          { name: 'Kills', value: this.totalGameAverage.finalBlowsAvgPer10Min },
          { name: 'Offensive Assists', value: this.totalGameAverage.offensiveAssistsAvgPer10Min },
          { name: 'Defensive Assists', value: this.totalGameAverage.defensiveAssistsAvgPer10Min },
          { name: 'Total Assists', value: totalAssists },
          { name: 'Deaths', value: this.totalGameAverage.deathsAvgPer10Min }
        ]
      }];

    this.combatChart = [{
      name: 'General',
      series: [
        { name: 'Hero Damage', value: this.totalGameAverage.heroDamageDoneAvgPer10Min },
        { name: 'Shield Damage', value: this.totalGameAverage.barrierDamageDoneAvgPer10Min },
        { name: 'Healing', value: this.totalGameAverage.healingDoneAvgPer10Min },
        { name: 'Blocked', value: this.totalGameAverage.damageBlockedAvgPer10Min }
      ]
    }];
  }
}
