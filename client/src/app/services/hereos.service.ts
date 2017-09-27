import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HeroesSearchResponse } from '../models';
import { Heroes } from './queries';
import { OverwatchHeroDataService } from './owherodata.service';
import { find, propEq, merge, map, assoc, prop } from 'ramda';

const hydrateHero = (heroData, roles) => hero => {
  const hydratedHero = merge(find(propEq('code', hero.code), heroData), hero);
  return assoc('role', prop('name', find(propEq('id', hydratedHero.role), roles)), hydratedHero);
};

@Injectable()
export class HereosService {
  constructor(
    private apollo: Apollo,
    private owHeroData: OverwatchHeroDataService
  ) {}

  get() {
    return this.apollo.query<HeroesSearchResponse>({ query: Heroes })
    .map(({ data: { heroes } }) => heroes)
    .withLatestFrom(this.owHeroData.data$, (heroes, { heroes: heroData, roles }) => map(hydrateHero(heroData, roles), heroes));
  }
}
