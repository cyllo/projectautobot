import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ComparePlayers } from './queries';

interface ComparePlayersResponse {
  gamerTags: any[];
}

@Injectable()
export class CompareService {
  constructor(private apollo: Apollo) {}

  fetchStatistics({ ids, type, startDate, endDate }) {
    return this.apollo.query<ComparePlayersResponse>({
      query: ComparePlayers,
      variables: {
        ids,
        type,
        startDate,
        endDate
      }
    })
      .map(response => response.data.gamerTags);
  }
}
