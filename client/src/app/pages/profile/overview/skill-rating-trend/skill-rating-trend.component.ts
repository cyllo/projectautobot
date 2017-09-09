import { Component, OnInit, Input } from '@angular/core';
import { ChartData, ChartType } from '../../../../models';
import { Observable } from 'rxjs/Observable';
import { map, path, append } from 'ramda';

@Component({
  selector: 'ow-skill-rating-trend',
  templateUrl: 'skill-rating-trend.component.html',
  styleUrls: [ 'skill-rating-trend.component.scss' ]
})

export class SkillRatingTrendComponent implements OnInit {
  @Input() skillRatingTrend: Observable<any[]>;
  chart: Observable<ChartData>;

  constructor() {}

  ngOnInit() {
    this.chart = this.skillRatingTrend.map(skillRatingTrend => {
      const SRTrend = map(path(['profileSnapshotStatistic', 'profileStatistic', 'competitiveLevel']), skillRatingTrend);

      const [xAxisLabels, data] = <any[]>SRTrend
      .reduce((acc, item, index) => ([append(index + 1, acc[0]), append(item, acc[1])]), [[], []]);

      return {
        xAxisLabels,
        datasets: [{ label: 'Skill Rating', data }],
        chartType: ChartType.line,
        legend: false
      };
    });
  }
}
