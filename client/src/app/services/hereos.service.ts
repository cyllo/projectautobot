import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HeroesSearchResponse } from '../models';
import { Heroes } from './queries';


@Injectable()
export class HereosService {
  constructor(private apollo: Apollo) {}

  get() {
    return this.apollo.query<HeroesSearchResponse>({ query: Heroes })
    .filter(s => !!s.data.heroes);
  }
}
