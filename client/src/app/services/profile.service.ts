import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Apollo } from 'apollo-angular';
import { ApolloError } from 'apollo-client';
import { Store } from '@ngrx/store';
import { assoc, merge, prop, pathOr, test, isNil, not, compose, find, equals, replace, last, propOr, propEq, filter } from 'ramda';

import { Player, GamerTag, StatChangeResponse, SnapshotStatistic } from '../models';

import { GamerTagService } from './gamer-tag.service';
import { SocketService } from './socket.service';
import { ErrorHandlerService } from './error-handler.service';
import { OverwatchHeroDataService } from './owherodata.service';
import { GamerTagStatsChange } from './queries';
import { addProfile, ReducerStack } from '../reducers';

const GAMER_TAG_CHANNEL = 'gamer_tag:lobby';

const notNil = compose(not, isNil);

const mustWait = test(/must wait/i);

@Injectable()
export class ProfileService {
  constructor(
    private router: Router,
    private gamerTagService: GamerTagService,
    private socketService: SocketService,
    private owHeroData: OverwatchHeroDataService,
    private apollo: Apollo,
    private store: Store<ReducerStack>,
    private errorService: ErrorHandlerService
  ) { }

  goto({ tag, platform, region }: GamerTag) {
    const destination = platform === 'pc'
    ? ['./profile', platform, region, replace('#', '-', tag)]
    : ['./profile', platform, replace('#', '-', tag)];
    this.router.navigate(destination);
  }
// to do fix this crap.
  find(tag, platform, region) {
    this.scrape(tag, platform, region)
    .catch((error: ApolloError) => {
      const cleanError = this.errorService.filterGraphqlMessage(error);
      return mustWait(cleanError.message)
      ? this.findPlayer(tag, platform, region)
      : Observable.throw(error);
    })
    .mergeMap((gamerTag: GamerTag) => <Observable<GamerTag>>this.addOwData(gamerTag))
    .subscribe(gamerTag => this.store.dispatch(addProfile(gamerTag)));
  }

  scrape(tag, platform, region) {
    return this.gamerTagService.scrape(tag, platform, region);
  }

  findPlayer(tag, platform, region) {
    return this.gamerTagService.getByProfileKey(tag, platform, region);
  }

  profileStats(player: GamerTag) {
    return pathOr([], ['profileSnapshotStatistic', 'profileStatistic'], last(<Array<any>>propOr([], 'snapshotStatistics', player)));
  }

  watch(isWatching, id ) {
    return isWatching
    ? this.gamerTagService.startWatching(id)
    : this.gamerTagService.stopWatching(id);
  }

  latestStatsSet(player: GamerTag) {
    return {
      competitive: this.getLatestSnapshot(player, true),
      quickPlay: this.getLatestSnapshot(player, false)
    };
  }

  observeChanges(playerId: number) {
    return this.socketService.join(GAMER_TAG_CHANNEL)
    .let(this.socketService.filterEvent('change'))
    .pluck('gamerTags')
    .map((val: number[]) => find(equals(playerId), val))
    .filter(notNil)
    .mergeMap((id: number) => this.gamerTagService.getById(id));
  }

  leaveChangesChannel() {
    return this.socketService.leave(GAMER_TAG_CHANNEL);
  }

  addOwData(gamerTag: GamerTag) {
    if (gamerTag.snapshotStatistics) {
      return Observable.forkJoin([Observable.of(gamerTag), this.owHeroData.data$])
        .map(([playerTag, owHeroData]: [Player, any]) => {
          return merge(playerTag, {
            snapshotStatistics: playerTag.snapshotStatistics
              .map(this.addHeroDataToSnapshot(owHeroData))
          });
        });
    } else {
      return Observable.of(gamerTag);
    }
  }

  getOverviewStatChanges(player: GamerTag) {
    const since = new Date();
    since.setDate(since.getDate() - 1);

    const variables = { id: player.id, since };
    return this.apollo.query<StatChangeResponse>({ query: GamerTagStatsChange, variables })
      .map((response) => {
        const { pastStatistics, currentStatistics } = response.data.gamerTag;
        const current = currentStatistics[0].heroesTotalSnapshotStatistic.gameHistoryStatistic;
        const past = pastStatistics[0].heroesTotalSnapshotStatistic.gameHistoryStatistic;

        return {
          winPercentage: (current.winPercentage / past.winPercentage) - 1
        };
      });
  }
// INTERNAL PRIVATE METHODS
  private addHeroesToHeroSnapshot(heroesData) {
    return function(accum, heroSnapshot) {
      const { roles, heroes } = heroesData;
      const selectedHero = heroes.find(({ code }) => code === heroSnapshot.hero.code);
      if (selectedHero) {
        const mapRole = (hero, roleList) =>  {
          const [{ name }] = filter(propEq('id', hero.role), roleList);
          return name;
        };
        return accum.concat(merge(heroSnapshot, { hero: assoc('role', mapRole(selectedHero, roles), selectedHero) }));
      }
      return accum;
    };
  }

  private addHeroDataToSnapshot(heroes) {
    return (snapshot) => {
      return Object.assign({}, snapshot, {
        quickplayHeroSnapshotStatistics: snapshot.quickplayHeroSnapshotStatistics.reduce(this.addHeroesToHeroSnapshot(heroes), []),
        competitiveHeroSnapshotStatistics: snapshot.competitiveHeroSnapshotStatistics.reduce(this.addHeroesToHeroSnapshot(heroes), [])
      });
    };
  }

  private getLatestSnapshot(player: GamerTag, isCompetitive: boolean) {
    if (!player.snapshotStatistics) {
      return null;
    }

    const snapshotStatistic = last(<SnapshotStatistic[]>prop('snapshotStatistics', player));
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
