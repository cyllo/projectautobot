import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, CurrentHero } from '../../models';
import { HeroStatistics } from '../../services';

@Component({
  selector: 'ow-hero',
  templateUrl: 'hero.component.html',
  styleUrls: [ 'hero.component.scss' ],
  providers: [HeroStatistics]
})

export class HeroComponent {
  $currentHero: CurrentHero;

  constructor(private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private heroStatistics: HeroStatistics) {
    const findHeroByName = (name) => (heroes) => heroes.find((hero) => hero.name.toLowerCase() === name.toLowerCase());
    const heroIdFromStore = (name) => (observable) => observable
      .select('heroes')
      .map(findHeroByName(name))
      .filter(hero => !!hero)
      .map((hero) => this.loadHeroData(hero.id));

    this.activatedRoute.params
      .switchMap(({hero}) => this.store.let(heroIdFromStore(hero)))
      .subscribe(() => {});

    this.store.select(state => state.currentHero).subscribe(data => this.$currentHero = data);
  }

  loadHeroData(id: number) {
    return this.heroStatistics.averagesById(id)
    .subscribe(heroStatisticsAverage => this.store.dispatch({ type: 'GET_CURRENT_HERO_DATA', payload: heroStatisticsAverage }));
  }

}
