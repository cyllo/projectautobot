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
  toLower,
  converge,
  applySpec,
  pick,
  merge } from 'ramda';
import { GamerTagService } from '../../../services';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ow-profile-overview',
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.component.scss'],
  providers: [GamerTagService]
})

export class ProfileOverviewComponent implements OnInit {
  @Input() profile: GamerTag;
  @Input() modeIndicator: {enabled: boolean, mode: string };
  lifeTimeStats: CombatLifetimeStats;
  gameHistory: GameHistoryStats;
  heroes: any;
  heroStatsByRole: any;
  totalGameAverage: any;
  matchAwards: any;
  skillRatingTrend: Observable<any[]>;
  mostPlayedHeroes: any;
  recentSnapshots: any[];
  heroStatistics: any[];

  constructor(private gamerTagService: GamerTagService) {}

  ngOnInit() {
    this.lifeTimeStats = <CombatLifetimeStats>path([
      this.modeIndicator.mode,
      'heroesTotalSnapshotStatistic',
      'combatLifetimeStatistic'
    ], this.profile);

    this.gameHistory = <GameHistoryStats>path([
      this.modeIndicator.mode,
      'heroesTotalSnapshotStatistic',
      'gameHistoryStatistic'
    ], this.profile);

    this.totalGameAverage = path([
      this.modeIndicator.mode,
      'heroesTotalSnapshotStatistic',
      'gameAverageStatistic'
    ], this.profile);

    this.matchAwards = path([
      this.modeIndicator.mode,
      'heroesTotalSnapshotStatistic',
      'matchAwardsStatistic'
    ], this.profile);

    this.heroStatistics = <any>path([
      this.modeIndicator.mode,
      'heroSnapshotStatistics'
    ], this.profile);

    const buildStatsByRole = heroes => {
      const kills = reduce((accum, hero) => add(accum, pathOr(0, ['combatLifetimeStatistic', 'eliminations'], hero)), 0, heroes);
      const deaths = reduce((accum, hero) => add(accum, pathOr(0, ['combatLifetimeStatistic', 'deaths'], hero)), 0, heroes);
      const wins = reduce((accum, hero) => add(accum, pathOr(0, ['gameHistoryStatistic', 'gamesWon'], hero)), 0, heroes);
      const timePlayed = reduce((accum, hero) => add(accum, pathOr(0, ['gameHistoryStatistic', 'timePlayed'], hero)), 0, heroes);
      return { kills, deaths, wins, timePlayed, KDratio: divide(kills, deaths).toFixed(2), name: path(['hero', 'role'], head(heroes)) };
    };

    this.heroes = groupBy(path<string>(['hero', 'role']), path<any[]>([this.modeIndicator.mode, 'heroSnapshotStatistics'], this.profile));

    this.heroStatsByRole = values(map(buildStatsByRole, this.heroes));


    this.skillRatingTrend = this.gamerTagService.skillRatingTrend(this.profile.id);

    const gameTypeHeroes = path([this.modeIndicator.mode, 'heroSnapshotStatistics']);
    const heroTimePlayed = path(['gameHistoryStatistic', 'timePlayed']);
    const timePlayedComparator = comparator(useWith(gt, [heroTimePlayed, heroTimePlayed]));

    const sortHeroesByMostPlayed = compose(take(4), sort(timePlayedComparator), gameTypeHeroes);

    this.mostPlayedHeroes = sortHeroesByMostPlayed(this.profile);

    const selectHeroesSnapshot = converge(merge, [
      pick(['insertedAt', 'profileSnapshotStatistic']),
      applySpec({
        heroesTotalSnapshotStatistic: prop(`${toLower(this.modeIndicator.mode)}HeroesTotalSnapshotStatistic`),
        heroSnapshotStatistic: prop(`${toLower(this.modeIndicator.mode)}HeroSnapshotStatistics`)
      })
    ]);

    const recentStats = compose(map(selectHeroesSnapshot), prop('snapshotStatistics'));
    this.recentSnapshots = recentStats(this.profile);
  }
}
