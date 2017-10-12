import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GraphqlResponse } from '../models';
import { FetchSnapshot, SnapshotDifference, FetchSnapshotById, StatisticsAveragesSnapshot } from './queries';
import {
  toLower,
  converge,
  applySpec,
  pick,
  merge,
  prop,
  map,
  compose,
  sort,
  filter,
  equals,
  comparator,
  useWith,
  gt,
  path,
  not,
  assoc,
  multiply,
  toUpper,
  divide,
  isNil
} from 'ramda';

const heroTimePlayed = path<number>(['gameHistoryStatistic', 'timePlayed']);

@Injectable()
export class SnapshotService {
  constructor(private apollo: Apollo) { }

  findByGamerTag(id: number, numSnapshots = 2) {
    return this.apollo.query({
      query: FetchSnapshotById,
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

  selectAveragesSnapshot(mode: string, heroId: number) {
    const selectAveragesSnapshot = converge(merge, [
      pick(['insertedAt', 'id']),
      applySpec({
        heroesTotalSnapshotStatistic: path([`hero${mode}Averages`, heroId]),
      })
    ]);
    const undefinedStatistic = compose(not, isNil, prop('heroesTotalSnapshotStatistic'));

    return compose(filter(undefinedStatistic), map(selectAveragesSnapshot));
  }

  diff(snapshotStatisticAId, snapshotStatisticBId) {
    return this.apollo.query({
      query: SnapshotDifference,
      variables: { snapshotStatisticAId, snapshotStatisticBId }
    })
    .map(({ data: { snapshotStatisticDifference } }: GraphqlResponse) => snapshotStatisticDifference);
  }

  heroesByTimePlayed(heroes: any[]) {
    const timePlayedComparator = comparator(useWith(gt, [heroTimePlayed, heroTimePlayed]));
    const hasPlayed = compose(not, equals(0), heroTimePlayed);

    return compose(sort(timePlayedComparator), filter(hasPlayed))(heroes);
  }

  percentagePlayed(totalTimePlayed: number) {
    return map(hero => assoc(
      'percentagePlayed',
      multiply(divide(heroTimePlayed(hero), totalTimePlayed), 100).toFixed(2),
      hero)
    );
  }

  get(mode: string, snapshotLast = 1) {
    return this.apollo.query({
      query: FetchSnapshot,
      variables: { type: toUpper(mode), snapshotLast }
    })
    .map(({ data: { snapshotStatistics } }: GraphqlResponse) => snapshotStatistics);
  }

  getStatisticsAverages(last = 1) {
    return this.apollo.query({
      query: StatisticsAveragesSnapshot,
      variables: { last }
    })
    .map(({ data: { statisticsAveragesSnapshots } }: GraphqlResponse) => statisticsAveragesSnapshots);
  }
}
