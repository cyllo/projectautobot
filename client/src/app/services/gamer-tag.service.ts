import { path, clone } from 'ramda';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GamerTag, GamerTagSearchResponse, GamerTagFetchResponse, GamerTagScrapeResponse, GraphqlResponse } from '../models';
import { SearchGamerTag, ScrapeGamerTag, FetchGamerTag, SkillRatingTrend } from './queries';

const scrapeGamerTagData = path<GamerTag>(['data', 'scrapeGamerTag']);
const gamerTagData = path<GamerTag>(['data', 'gamerTag']);

@Injectable()
export class GamerTagService {
  constructor(private apollo: Apollo) { }

  find(tag) {
    return this.apollo.mutate<GamerTagSearchResponse>({ mutation: SearchGamerTag, variables: { tag } })
    .map(({ data }) => data.searchGamerTag)
    .map(clone);
  }

  getById(id: number, numSnapshots = 2) {
    return this.apollo.query<GamerTagFetchResponse>({
      query: FetchGamerTag,
      variables: { id, snapshotLast: numSnapshots }
    })
    .map(gamerTagData);
  }

  getByProfileKey(tag: string, platform: string, region = '', numSnapshots = 3) {
    return this.apollo.query<GamerTagFetchResponse>({
      query: FetchGamerTag,
      variables: { tag, platform, region, snapshotLast: numSnapshots}
    })
    .map(gamerTagData);
  }

  scrape(tag: string, platform: string, region = '', numSnapshots = 3) {
    return this.apollo.mutate<GamerTagScrapeResponse>({
      mutation: ScrapeGamerTag,
      variables: { tag, platform, region, snapshotLast: numSnapshots}
    })
    .map(scrapeGamerTagData);
  }

  skillRatingTrend(id: number) {
    return this.apollo.query({
      query: SkillRatingTrend,
      variables: { id }
    })
    .map(({ data: { gamerTag: { snapshotStatistics } } }: GraphqlResponse) => snapshotStatistics);
  }
}
