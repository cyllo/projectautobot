import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Heroes } from '../models';
import { heroSearchQuery } from './queries';

interface HeroesSearchResponse {
  heroes: Heroes[];
  loading: boolean;
}

@Injectable()
export class HereosService {
  constructor(private apollo: Apollo) {}

  get() {
    return this.apollo.query<HeroesSearchResponse>({ query: heroSearchQuery })
    .filter(s => !!s.data.heroes);
  }
}
