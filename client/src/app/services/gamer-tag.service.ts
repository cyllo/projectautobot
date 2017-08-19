import { path, clone } from 'ramda';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GamerTag, GamerTagSearchResponse, GamerTagFetchResponse, GamerTagScrapeResponse } from '../models';
import { gamerTagSearchMutation, gamerTagScrapeMutation, gamerTagFetchQuery } from './queries';

const scrapeGamerTagData = path<GamerTag>(['data', 'scrapeGamerTag']);
const gamerTagData = path<GamerTag>(['data', 'gamerTag']);

@Injectable()
export class GamerTagService {
  constructor(private apollo: Apollo) { }

  find(tag) {
    return this.apollo.mutate<GamerTagSearchResponse>({ mutation: gamerTagSearchMutation, variables: { tag } })
    .map(({ data }) => data.searchGamerTag)
    .map(clone);
  }

  getById(id: number, numSnapshots = 2) {
    return this.apollo.query<GamerTagFetchResponse>({
      query: gamerTagFetchQuery,
      variables: { id, snapshotLast: numSnapshots }
    })
    .map(gamerTagData);
  }

  getByProfileKey(tag: string, platform: string, region = '', numSnapshots = 2) {
    return this.apollo.query<GamerTagFetchResponse>({
      query: gamerTagFetchQuery,
      variables: { tag, platform, region, snapshotLast: numSnapshots}
    })
    .map(gamerTagData);
  }

  scrape(tag: string, platform: string, region = '', numSnapshots = 2) {
    return this.apollo.mutate<GamerTagScrapeResponse>({
      mutation: gamerTagScrapeMutation,
      variables: { tag, platform, region, snapshotLast: numSnapshots}
    })
    .map(scrapeGamerTagData);
  }
}
