import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Player } from '../models';
import { gamerTagSearchQuery, gamerTagFetchQuery } from './queries';

interface GamerTagSearchResponse {
  searchGamerTag: Player[];
  loading: boolean;
}

export interface GamerTagFetchResponse {
  gamerTag: Player;
  loading: boolean;
}

@Injectable()
export class GamerTagService {
  constructor(private apollo: Apollo) { }

  find(tag) {
    return this.apollo.query<GamerTagSearchResponse>({ query: gamerTagSearchQuery, variables: { tag } })
      .map(({ data }) => data.searchGamerTag)
      .filter(data => data.length > 0);
  }

  getGamerTagStats(id: number) {
    return this.apollo.query<GamerTagFetchResponse>({ query: gamerTagFetchQuery, variables: { id } })
      .map(({ data }) => data.gamerTag);
  }
}
