import { Component, OnInit, Input  } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChartData, ChartType } from '../../../../models';
import { Observable } from 'rxjs/Observable';
import { reduce } from 'ramda';

@Component({
  selector: 'ow-skill-rating-trend',
  templateUrl: 'skill-rating-trend.component.html',
  styleUrls: [ 'skill-rating-trend.component.scss' ],
  providers: [DatePipe]
})

export class SkillRatingTrendComponent implements OnInit {
  @Input() skillRatingTrend: Observable<any[]>;
  chart: Observable<ChartData>;

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    this.chart = this.skillRatingTrend.map(skillRatingTrend => {
      const [xAxisLabels, data] = reduce((accum, { insertedAt, profileSnapshotStatistic: { profileStatistic: { competitiveLevel} } }) => {
        const [labels, sr] = accum;
        return [[this.datePipe.transform(insertedAt, 'MM-dd'), ...labels], [competitiveLevel, ...sr]];
      }, [[], []], skillRatingTrend);

      return {
        xAxisLabels,
        datasets: [{ label: 'Skill Rating', data }],
        chartType: ChartType.line,
        legend: false
      };
    });
  }
}
