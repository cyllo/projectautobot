import { Component, OnInit  } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { isEmpty } from 'ramda';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../models';
import { TrendsService } from '../../../../services';


@Component({
  selector: 'ow-skill-rating-trend',
  templateUrl: 'skill-rating-trend.component.html',
  styleUrls: [ 'skill-rating-trend.component.scss' ],
  providers: [TrendsService]
})

export class SkillRatingTrendComponent implements OnInit {
  chart: Observable<any>;
  ngxChart: Observable<any>;

  constructor(
    private store: Store<AppState>,
    private trends: TrendsService
  ) {}

  ngOnInit() {
    this.chart = this.store.select('statTrends')
    .skipWhile(isEmpty)
    .map(skillRatingTrend => this.trends.skillRating(skillRatingTrend))
    .map(series => [{ name: 'Skill Rating', series }]);
  }
}
