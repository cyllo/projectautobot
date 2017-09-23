import { Component, OnInit, Input  } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { map } from 'ramda';

@Component({
  selector: 'ow-skill-rating-trend',
  templateUrl: 'skill-rating-trend.component.html',
  styleUrls: [ 'skill-rating-trend.component.scss' ],
  providers: [DatePipe]
})

export class SkillRatingTrendComponent implements OnInit {
  @Input() skillRatingTrend: Observable<any[]>;
  chart: Observable<any>;
  ngxChart: Observable<any>;

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    this.chart = this.skillRatingTrend.map(SkillRatingTrend => {
      return map(({ insertedAt, profileSnapshotStatistic: { profileStatistic: { competitiveLevel } } }) => {
        return { name: this.datePipe.transform(insertedAt, 'MM-dd HH:mm'), value: competitiveLevel };
      }, SkillRatingTrend);
    })
    .map(series => [{ name: 'Skill Rating', series }]);
  }
}
