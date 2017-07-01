import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Player } from '../models';
import { gamerTagSearchQuery } from './queries';

interface GamerTagSearchResponse {
  searchGamerTag: Player[];
  loading: boolean;
}

@Injectable()
export class GamerTagService {
  constructor(private apollo: Apollo) {}

  find(tag) {
    return this.apollo.query<GamerTagSearchResponse>({ query: gamerTagSearchQuery, variables: { tag } })
      .map(({data}) => data.searchGamerTag)
      .filter(data => data.length > 0);
  }
}
