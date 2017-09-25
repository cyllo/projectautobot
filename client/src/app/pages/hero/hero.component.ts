import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../models';
import { getHeroByName } from '../../reducers';
import { notEmpty, HeroStatistics } from '../../services';
import { Observable } from 'rxjs/Observable';
import { toLower } from 'ramda';

@Component({
  selector: 'ow-hero',
  templateUrl: 'hero.component.html',
  styleUrls: [ 'hero.component.scss' ],
})

export class HeroComponent implements OnInit {
  hero: Observable<any>;
  heroStats: Observable<any>;
  heroes: Observable<any>;
  heroImage: Observable<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private heroStatsService: HeroStatistics,
  ) {}

  ngOnInit() {

    this.heroes = this.store.select('heroes').filter(notEmpty);

    this.hero = this.activatedRoute.params
    .pluck('hero')
    .switchMap((hero: string) => this.heroes.let(getHeroByName(hero)))
    .do(val => console.log('the hero', val));

    this.heroImage = this.hero.map(({ name }) => `./img/hero_renders/${toLower(name)}.png`);

    this.heroStats = this.hero
    .switchMap(({ id }) => this.heroStatsService.averagesById(id))
    .pluck('competitiveHeroAverages')
    .do(val => console.log('the stats', val));

  }
}
