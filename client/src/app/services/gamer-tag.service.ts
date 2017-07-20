import { path, assoc, clone } from 'ramda';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Player } from '../models';
import { gamerTagSearchQuery, gamerTagScrapeMutation, gamerTagFetchQuery } from './queries';

interface GamerTagSearchResponse {
  searchGamerTag: Player[];
  loading: boolean;
}

export interface GamerTagFetchResponse {
  gamerTag: Player;
  loading: boolean;
}

export interface GamerTagScrapeResponse {
  scrapeGamerTag: Player;
  loading: boolean;
}

const scrapeGamerTagData = path<Player>(['data', 'scrapeGamerTag']);
const gamerTagData = path<Player>(['data', 'gamerTag']);

const addSnapshotLast = assoc<any>('snapshotLast');
const clonePlayer = (player: Player) => clone<Player>(player);

@Injectable()
export class GamerTagService {
  constructor(private apollo: Apollo) { }

  find(tag) {
    return this.apollo.query<GamerTagSearchResponse>({ query: gamerTagSearchQuery, variables: { tag } })
      .map(({ data }) => data.searchGamerTag)
      .map(clone);
  }

  getGamerTagStatsById(id: number, numSnapshots = 2) {
    return this.apollo.query<GamerTagFetchResponse>({
      query: gamerTagFetchQuery,
      variables: addSnapshotLast(numSnapshots, { id })
    })
      .map(gamerTagData)
      .map(clonePlayer);
  }

  getGamerTagStatsByTagPlatformRegion(tag: string, platform: string, region = '', numSnapshots = 2) {
    return this.apollo.query<GamerTagFetchResponse>({
      query: gamerTagFetchQuery,
      variables: addSnapshotLast(numSnapshots, { tag, platform, region })
    })
      .map(gamerTagData)
      .map(clonePlayer);
  }

  scrapeGamerTagById(id: number, numSnapshots = 2) {
    return this.apollo.mutate<GamerTagScrapeResponse>({
      mutation: gamerTagScrapeMutation,
      variables: addSnapshotLast(numSnapshots, { id })
    })
      .map(scrapeGamerTagData)
      .map(clonePlayer);
  }

  scrapeGamerTagByTagPlatformRegion(tag: string, platform: string, region = '', numSnapshots = 2) {
    return this.apollo.mutate<GamerTagScrapeResponse>({
      mutation: gamerTagScrapeMutation,
      variables: addSnapshotLast(numSnapshots, { tag, platform, region })
    })
      .map(scrapeGamerTagData)
      .map(clonePlayer);
  }
}
