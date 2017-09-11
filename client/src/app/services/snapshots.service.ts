import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GraphqlResponse } from '../models';
import { FetchSnapshot } from './queries';
import {
  toLower,
  converge,
  applySpec,
  pick,
  merge,
  prop,
  map
} from 'ramda';

@Injectable()
export class SnapshotService {
  constructor(private apollo: Apollo) { }

  findByGamerTag(id: number, numSnapshots = 2) {
    return this.apollo.query({
      query: FetchSnapshot,
      variables: { id , snapshotLast: numSnapshots }
    })
    .map(({ data: { gamerTag: { snapshotStatistics } } }: GraphqlResponse ) => snapshotStatistics);
  }

  selectHeroesSnapshot(mode: string) {
    const selectHeroesSnapshot = converge(merge, [
      pick(['insertedAt', 'profileSnapshotStatistic', 'id']),
      applySpec({
        heroesTotalSnapshotStatistic: prop(`${toLower(mode)}HeroesTotalSnapshotStatistic`),
        heroSnapshotStatistic: prop(`${toLower(mode)}HeroSnapshotStatistics`)
      })
    ]);

    return map(selectHeroesSnapshot);
  }
}
