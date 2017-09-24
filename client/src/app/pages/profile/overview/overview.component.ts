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
  useWith,
  comparator,
  gt,
  compose,
  sort,
  take,
  prop,
} from 'ramda';
import { GamerTagService, SnapshotService } from '../../../services';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ow-profile-overview',
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.component.scss'],
  providers: [GamerTagService, SnapshotService, DatePipe]
})

export class ProfileOverviewComponent implements OnInit {
  @Input() profile: GamerTag;
  @Input() modeIndicator: Observable<{enabled: boolean, mode: string }>;
  lifeTimeStats: Observable<CombatLifetimeStats>;
  gameHistory: Observable<GameHistoryStats>;
  heroStatsByRole: Observable<any>;
  totalGameAverage: Observable<any>;
  matchAwards: Observable<any>;
  mostPlayedHeroes: Observable<any[]>;
  recentSnapshots: Observable<any[]>;
  heroStatistics: Observable<any[]>;

  constructor(
    private snapshotService: SnapshotService
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
      const heroTimePlayed = path(['gameHistoryStatistic', 'timePlayed']);
      const timePlayedComparator = comparator(useWith(gt, [heroTimePlayed, heroTimePlayed]));

      const sortHeroesByMostPlayed = compose(take(4), sort(timePlayedComparator), gameTypeHeroes);
      return sortHeroesByMostPlayed(this.profile);
    });


    this.recentSnapshots = this.modeIndicator
    .map(({ mode }) => {
      const recentStats = compose(this.snapshotService.selectHeroesSnapshot(mode), prop('snapshotStatistics'));
      return recentStats(this.profile);
    });
  }
}
