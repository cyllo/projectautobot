import { Component, OnInit, Input } from '@angular/core';
import { GamerTag, GameHistoryStats, CombatLifetimeStats } from '../../../models';
import {
  path,
  groupBy,
  reduce,
  add,
  pathOr,
  map,
  divide,
  head,
  values,
  compose,
  take,
  prop,
  assoc,
  flip,
  gte,
  length,
  merge,
  find,
  propEq,
  takeLast
} from 'ramda';
import { GamerTagService, SnapshotService, notEmpty } from '../../../services';
import { ReducerStack } from '../../../reducers';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';

@Component({
  selector: 'ow-profile-overview',
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.component.scss'],
  providers: [GamerTagService, SnapshotService, DatePipe]
})

export class ProfileOverviewComponent implements OnInit {
  @Input() profile: GamerTag;
  @Input() modeIndicator: Observable<{enabled: boolean, mode: string }>;
  @Input() snapshotDiff: any;
  lifeTimeStats: Observable<CombatLifetimeStats>;
  gameHistory: Observable<GameHistoryStats>;
  heroStatsByRole: Observable<any>;
  totalGameAverage: Observable<any>;
  matchAwards: Observable<any>;
  mostPlayedHeroes: Observable<any[]>;
  recentSnapshots: Observable<any[]>;
  heroStatistics: Observable<any[]>;
  modifiedModeIndicator: Observable<string>;
  recentlyPlayed: Observable<any>;

  constructor(
    private snapshotService: SnapshotService,
    private store: Store<ReducerStack>
  ) {}

  ngOnInit() {
    this.lifeTimeStats = this.modeIndicator
    .map(({ mode }) => path([mode, 'heroesTotalSnapshotStatistic', 'combatLifetimeStatistic'], this.profile));

    this.gameHistory = this.modeIndicator
    .map(({ mode }) => path([mode, 'heroesTotalSnapshotStatistic', 'gameHistoryStatistic'], this.profile));

    this.totalGameAverage = this.modeIndicator
    .map(({ mode }) => path([mode, 'heroesTotalSnapshotStatistic', 'gameAverageStatistic'], this.profile));

    this.matchAwards = this.modeIndicator
    .map(({ mode }) => path([mode, 'heroesTotalSnapshotStatistic', 'matchAwardsStatistic'], this.profile));

    this.heroStatistics = this.modeIndicator
    .map(({ mode }) => path([mode, 'heroSnapshotStatistics'], this.profile));

    const buildStatsByRole = heroes => {
      const kills = reduce((accum, hero) => add(accum, pathOr(0, ['combatLifetimeStatistic', 'eliminations'], hero)), 0, heroes);
      const deaths = reduce((accum, hero) => add(accum, pathOr(0, ['combatLifetimeStatistic', 'deaths'], hero)), 0, heroes);
      const wins = reduce((accum, hero) => add(accum, pathOr(0, ['gameHistoryStatistic', 'gamesWon'], hero)), 0, heroes);
      const timePlayed = reduce((accum, hero) => add(accum, pathOr(0, ['gameHistoryStatistic', 'timePlayed'], hero)), 0, heroes);
      return { kills, deaths, wins, timePlayed, KDratio: divide(kills, deaths).toFixed(2), name: path(['hero', 'role'], head(heroes)) };
    };

    this.heroStatsByRole = this.modeIndicator
    .map(({ mode }) => {
      const heroes = groupBy(path<string>(['hero', 'role']), path<any[]>([mode, 'heroSnapshotStatistics'], this.profile));
      return values(map(buildStatsByRole, heroes));
    });

    this.mostPlayedHeroes = this.modeIndicator
    .map(({ mode }) => {
      const gameTypeHeroes = path([mode, 'heroSnapshotStatistics']);

      const sortHeroesByMostPlayed = compose(take(4), this.snapshotService.heroesByTimePlayed, gameTypeHeroes);
      return sortHeroesByMostPlayed(this.profile);
    });

    this.modifiedModeIndicator = this.modeIndicator.map(({ mode }) => {
      switch (mode) {
        case 'quickPlay':
          return 'Quickplay';
        case 'competitive':
          return 'Competitive';
      }
    });

    this.recentSnapshots = this.modeIndicator
    .map(({ mode }) => {
      const recentStats = compose(this.snapshotService.selectHeroesSnapshot(mode), prop('snapshotStatistics'));
      return recentStats(this.profile);
    });

    const flippedGte = flip(gte);
    const hasMultipleSnapshots = compose(flippedGte(2), length, prop('snapshotStatistics'));

    this.recentlyPlayed = this.modifiedModeIndicator
    .mapTo(this.profile)
    .filter(hasMultipleSnapshots)
    .pluck('snapshotStatistics')
    .switchMap((snapshotStatistics: any[]) => {
      const [{ id: snapshotAId }, { id: snapshotBId }] = takeLast(2, snapshotStatistics);
      return this.snapshotService.diff(snapshotAId, snapshotBId);
    })
    .withLatestFrom(this.modifiedModeIndicator, (snapshotDiff, mode) => {
      const totalTimePlayed = path<number>([
      'heroSnapshotStatistics',
      `heroTotal${mode}`,
      'gameHistoryStatistic',
      'timePlayed'], snapshotDiff);

      const createHeroArray = compose(
        reduce((acc, [id, obj]) => acc.concat(assoc('id', parseInt(id), obj)), []),
        Object.entries,
        path(['heroSnapshotStatistics', `hero${mode}`])
      );

      const sortHeroPlayTime = compose(
        this.snapshotService.percentagePlayed(totalTimePlayed),
        this.snapshotService.heroesByTimePlayed,
        createHeroArray
      );
      return sortHeroPlayTime(snapshotDiff);
    })
    .filter(notEmpty)
    .withLatestFrom(this.store.select('heroes'), (heroes, heroesStore: any[]) => {
      const combineHeroData = hero => merge(hero, find(propEq('id', hero.id), heroesStore));
      return map(combineHeroData, heroes);
    });
  }
}
