import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ListLeaderboard, FetchGamertags } from './queries';
import { GamerTag, LeaderboardSnapshotStatistic, Rankings, GraphqlResponse } from '../models';
import {
  keys,
  map,
  partialRight,
  prop,
  reverse,
  sortBy,
  take,
  toString
} from 'ramda';

const toNumber = partialRight(parseInt, [10]);

@Injectable()
export class LeaderboardService {
  constructor(private apollo: Apollo) {}

  public getLeaderboard(platform: string, region: string, gamemode: string) {
    const rankingStream = this.apollo.query<{ leaderboardSnapshotStatistic: LeaderboardSnapshotStatistic }>({
      query: ListLeaderboard,
      variables: {
        rankBy: { platform, region }
      }
    })
      .map(({ data: { leaderboardSnapshotStatistic: rankings} }: GraphqlResponse) => {
        switch (gamemode) {
          case 'quickplay':
            return rankings.heroTotalQuickplayRankings.gamesWon;
          case 'competitive':
            return rankings.profileStatsRankings.competitiveLevel;
        }
      });

    return rankingStream.switchMap((rankings: Rankings) => {
      const gamerTagIds = map(toNumber, keys(rankings));
      return this.apollo.query<{ gamerTags: GamerTag[] }>({
        query: FetchGamertags,
        variables: {
          ids: gamerTagIds
        }
      });
    })
    .map(({ data: { gamerTags } }: GraphqlResponse) => gamerTags)
    .withLatestFrom(rankingStream, (gamerTags: GamerTag[], rankings: LeaderboardSnapshotStatistic) => {
      return sortBy(prop('position'), map(gamerTag => {
        const snapshot = gamerTag.snapshotStatistics[0];
        const heroesTotalStats = snapshot[`${gamemode}HeroesTotalSnapshotStatistic`];
        const heroStats = snapshot[`${gamemode}HeroSnapshotStatistics`];
        const heroStatsSortedByPlaytime = reverse(sortBy(heroStat => heroStat.gameHistoryStatistic.timePlayed, heroStats));
        const mostPlayedHeroes = map((heroStat: any) => heroStat.hero, take(3, heroStatsSortedByPlaytime));
        return {
          position: rankings[toString(gamerTag.id)].rank,
          platform: gamerTag.platform,
          region: gamerTag.region,
          player: {
            tag: gamerTag.tag,
            avatarUrl: gamerTag.portraitUrl
          },
          level: snapshot.profileSnapshotStatistic.profileStatistic.level,
          competitiveRating: {
            rankUrl: snapshot.profileSnapshotStatistic.profileStatistic.competitiveRankUrl,
            rank: snapshot.profileSnapshotStatistic.profileStatistic.competitiveLevel
          },
          timeOnFire: heroesTotalStats.combatLifetimeStatistic.timeSpentOnFire,
          kdRatio: heroesTotalStats.combatLifetimeStatistic.eliminationsPerLife,
          wins: heroesTotalStats.gameHistoryStatistic.gamesWon,
          lost: heroesTotalStats.gameHistoryStatistic.gamesLost,
          winRate: heroesTotalStats.gameHistoryStatistic.winPercentage,
          timePlayed: heroesTotalStats.gameHistoryStatistic.timePlayed,
          mostPlayedHeroes
        };
      }, gamerTags));
    });
  }
}
