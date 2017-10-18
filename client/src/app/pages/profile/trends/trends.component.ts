import { Component, OnInit, Input  } from '@angular/core';
import { Store } from '@ngrx/store';
import { isEmpty } from 'ramda';
import { Observable } from 'rxjs/Observable';
import { SnapshotService, TrendsService } from '../../../services';
import { ReducerStack } from '../../../reducers';

@Component({
  selector: 'ow-profile-trends',
  templateUrl: 'trends.component.html',
  styleUrls: ['trends.component.scss'],
  providers: [SnapshotService, TrendsService]
})

export class TrendsComponent implements OnInit {
  @Input() modeIndicator: Observable<{ disabled: boolean, mode: string }>;
  statTrends: Observable<any>;
  eliminations: Observable<any>;
  kdRatio: Observable<any>;
  accuracy: Observable<any>;
  damageDone: Observable<any>;
  damageBlocked: Observable<any>;
  healingDone: Observable<any>;
  winRate: Observable<any>;

  constructor(
    private store: Store<ReducerStack>,
    private snapshotService: SnapshotService,
    private trendsService: TrendsService
  ) {}

  ngOnInit() {
    this.statTrends = this.store.select('statTrends')
    .skipWhile(isEmpty)
    .combineLatest(this.modeIndicator, (trends, { mode }) => this.snapshotService.selectHeroesSnapshot(mode)(trends));

    this.eliminations = this.statTrends
    .map(trends => this.trendsService.eliminations(trends))
    .map(series => [{ name: 'Eliminations', series }]);

    this.kdRatio = this.statTrends
    .map(trends => this.trendsService.kdRatio(trends))
    .map(series => [{ name: 'KD Ratio', series }]);

    this.accuracy = this.statTrends
    .map(trends => this.trendsService.accuracy(trends))
    .map(series => [{ name: 'Accuracy', series }]);

    this.damageDone = this.statTrends
    .map(trends => this.trendsService.damageDone(trends))
    .map(series => [{ name: 'Damage Done', series }]);

    this.damageBlocked = this.statTrends
    .map(trends => this.trendsService.damageBlocked(trends))
    .map(series => [{ name: 'Damage Blocked', series }]);

    this.healingDone = this.statTrends
    .map(trends => this.trendsService.healingDone(trends))
    .map(series => [{ name: 'Healing Done', series }]);

    this.winRate = this.statTrends
    .map(trends => this.trendsService.eliminations(trends))
    .map(series => [{ name: 'Win Rate', series }]);
  }
}
