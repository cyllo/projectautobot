import { Component, OnInit, Input } from '@angular/core';
import { SnapshotService, TrendsService } from '../../../services';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

/**
 * TODO: rewrite component to be reusable with trends component in profile page. PUll this into it's own module
 */

@Component({
  selector: 'ow-hero-trends',
  templateUrl: 'trends.component.html',
  styleUrls: ['trends.component.scss'],
  providers: [SnapshotService, TrendsService, DatePipe]
})

export class HeroTrendsComponent implements OnInit {
  @Input() mode: BehaviorSubject<string>;
  @Input() hero: Observable<any>;
  statTrends: Observable<any>;
  eliminations: Observable<any>;
  kdRatio: Observable<any>;
  accuracy: Observable<any>;
  damageDone: Observable<any>;
  damageBlocked: Observable<any>;
  healingDone: Observable<any>;
  winRate: Observable<any>;

  constructor(
    private snapShotService: SnapshotService,
    private trendsService: TrendsService
  ) {}

  ngOnInit() {
    this.statTrends = this.snapShotService.getStatisticsAverages(7)
    .combineLatest(this.mode, this.hero, (trends, mode, { id: heroId }) => {
      return this.snapShotService.selectAveragesSnapshot(mode, heroId)(trends);
    })
    .share();


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
