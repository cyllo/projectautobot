import { equals, merge, head, pathOr, test } from 'ramda';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Apollo } from 'apollo-angular';
import { ApolloError } from 'apollo-client';

import { Player } from '../models';

import { GamerTagService } from './gamer-tag.service';
import { SocketService } from './socket.service';
import { OverwatchHeroDataService } from './owherodata.service';
import { OverwatchStaticData } from '../models';
import { playerStatsChangeQuery } from './queries';

const GAMER_TAG_CHANNEL = 'gamer_tag:lobby';

const graphqlErrorMessage = pathOr<string>('', ['graphQLErrors', 0, 'message']);
const testNotFound = test(/not found/i);

interface Statistic {
  heroesTotalSnapshotStatistic: {
    gameHistoryStatistic: {
      winPercentage: number;
    };
  };
}

interface StatChangeResponse {
  gamerTag: {
    currentStatistics: Statistic[];
    pastStatistics: Statistic[];
  };
}

@Injectable()
export class ProfileService {
  constructor(
    private router: Router,
    private gamerTagService: GamerTagService,
    private socketService: SocketService,
    private owHeroData: OverwatchHeroDataService,
    private apollo: Apollo
  ) { }

  goto(player: Player) {
    const tag = player.tag.replace('#', '-');

    if (player.region) {
      this.router.navigate(['./profile', player.platform, player.region, tag]);
    } else {
      this.router.navigate(['./profile', player.platform, tag]);
    }
  }

  findOrScrapeGamerTag(tag, platform, region) {
    return this.findPlayer(tag, platform, region)
      .catch((error) => this.onErrorScrapeGamerTag({tag, platform, region}, error));
  }

  scrapeGamerTag(tag, platform, region) {
    return this.gamerTagService.scrapeGamerTagByTagPlatformRegion(tag, platform, region);
  }

  findPlayer(tag, platform, region) {
    return this.gamerTagService.getGamerTagStatsByTagPlatformRegion(tag, platform, region);
  }

  latestStatsSet(player: Player) {
    return {
      competitive: this.getLatestSnapshot(player, true),
      quickPlay: this.getLatestSnapshot(player, false)
    };
  }

  observeChanges(playerId: number) {
    return this.socketService.join(GAMER_TAG_CHANNEL)
      .let(this.socketService.filterEvent('change'))
      .map(({ gamerTags }) => head<number>(gamerTags))
      .filter(equals(playerId))
      .switchMap((id) => this.gamerTagService.getGamerTagStatsById(id));
  }

  leaveChangesChannel() {
    return this.socketService.leave(GAMER_TAG_CHANNEL);
  }

  addOwData(gamerTag) {
    if (gamerTag.snapshotStatistics) {
      return Observable.forkJoin([Observable.of(gamerTag), this.owHeroData.data$])
        .map(([playerTag, owHeroData]: [Player, OverwatchStaticData]) => {
          return merge(playerTag, {
            snapshotStatistics: playerTag.snapshotStatistics
              .map(this.addHeroDataToSnapshot(owHeroData))
          });
        });
    } else {
      return Observable.of(gamerTag);
    }
  }

  getOverviewStatChanges(player: Player) {
    const since = new Date();
    since.setDate(since.getDate() - 1);

    const variables = { id: player.id, since };
    return this.apollo.query<StatChangeResponse>({ query: playerStatsChangeQuery, variables })
      .map((response) => {
        const { pastStatistics, currentStatistics } = response.data.gamerTag;
        const current = currentStatistics[0].heroesTotalSnapshotStatistic.gameHistoryStatistic;
        const past = pastStatistics[0].heroesTotalSnapshotStatistic.gameHistoryStatistic;

        return {
          winPercentage: (current.winPercentage / past.winPercentage) - 1
        };
      });
  }

  private onErrorScrapeGamerTag({ tag, platform, region }, apolloError: ApolloError) {
    if (testNotFound(graphqlErrorMessage(apolloError))) {
      return this.scrapeGamerTag(tag, platform, region);
    } else {
      return Observable.throw(apolloError);
    }
  }

  private addHeroesToHeroSnapshot(heroes) {
    return function(heroSnapshot) {
      return Object.assign({}, heroSnapshot, { hero: heroes.heroes.find(({ code }) => code === heroSnapshot.hero.code) });
    };
  }

  private addHeroDataToSnapshot(heroes) {
    return (snapshot) => {
      return Object.assign({}, snapshot, {
        quickplayHeroSnapshotStatistics: snapshot.quickplayHeroSnapshotStatistics.map(this.addHeroesToHeroSnapshot(heroes)),
        competitiveHeroSnapshotStatistics: snapshot.competitiveHeroSnapshotStatistics.map(this.addHeroesToHeroSnapshot(heroes))
      });
    };
  }

  private getLatestSnapshot(player: Player, isCompetitive: boolean) {
    if (!player.snapshotStatistics) {
      return null;
    }

    const [snapshotStatistic] = player.snapshotStatistics.reverse();
    if (!snapshotStatistic) {
      return null;
    }

    const gamemode = isCompetitive ? 'competitive' : 'quickplay';
    const transformedSnapshot = {
      heroSnapshotStatistics: snapshotStatistic[`${gamemode}HeroSnapshotStatistics`],
      heroesTotalSnapshotStatistic: snapshotStatistic[`${gamemode}HeroesTotalSnapshotStatistic`]
    };

    return transformedSnapshot;
  }
}
