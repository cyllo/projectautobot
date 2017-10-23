import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, toPairs } from 'ramda';
import { LeaderboardService } from '../../../services';
import { NgxChartResult } from '../../../models';

@Component({
  selector: 'ow-leaderboard-chart',
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.scss'],
  providers: [LeaderboardService]
})
export class LeaderboardChartComponent implements OnInit {

  data: Observable<NgxChartResult[]>;

  // options
  showXAxis = true;
  showYAxis = true;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Skill Rating';
  showYAxisLabel = false;
  yAxisLabel: string;

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit() {
    this.data = this.leaderboardService.getCompetitiveLevelDistribution()
      .map((dist: { [level: string]: number }) => map(([level, count]) => ({
        name: level,
        value: count
      }), toPairs<string, number>(dist)));
  }

}
