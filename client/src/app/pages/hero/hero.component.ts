import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { getHeroByName, ReducerStack } from '../../reducers';
import { notEmpty, HeroStatistics, SnapshotService } from '../../services';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { toLower } from 'ramda';

@Component({
  selector: 'ow-hero',
  templateUrl: 'hero.component.html',
  styleUrls: [ 'hero.component.scss' ],
})

export class HeroComponent implements OnInit {
  hero: Observable<any>;
  heroStats: Observable<any>;
  heroTotals: Observable<any>;
  heroes: Observable<any>;
  heroImage: Observable<any>;
  changePlatform$ = new BehaviorSubject<string>('pc');
  changeRegion$ = new BehaviorSubject<string>('us');
  changeMode$ = new BehaviorSubject<string>('competitive');

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<ReducerStack>,
    private heroStatsService: HeroStatistics,
    private snapShotService: SnapshotService
  ) {}

  ngOnInit() {

    this.heroes = this.store.select('heroes').filter(notEmpty);

    this.hero = this.activatedRoute.params
    .pluck('hero')
    .switchMap((hero: string) => this.heroes.let(getHeroByName(hero)))
    .share();

    this.heroImage = this.hero.map(({ name }) => `./img/hero_renders/${toLower(name)}.png`);

    this.heroStats = this.hero
    .combineLatest(this.changeRegion$, this.changePlatform$, this.changeMode$)
    .switchMap(([{ id }, region, platform, mode]) => this.heroStatsService.averagesById(id, platform, region, mode))
    .share();

    this.heroTotals = this.changeMode$
    .switchMap(mode => this.snapShotService.get(mode))
    .map(([{ heroesTotalSnapshotStatistic }]) => heroesTotalSnapshotStatistic);

  }
}
