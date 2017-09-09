import { Component, OnInit, Input } from '@angular/core';
import { GamerTag, GameHistoryStats, CombatLifetimeStats } from '../../../models';
import { path, groupBy, reduce, add, pathOr, map, divide, head, values } from 'ramda';

@Component({
  selector: 'ow-profile-overview',
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.component.scss']
})

export class ProfileOverviewComponent implements OnInit {
  @Input() profile: GamerTag;
  @Input() modeIndicator: {enabled: boolean, mode: string };
  lifeTimeStats: CombatLifetimeStats;
  gameHistory: GameHistoryStats;
  heroes: any;
  heroStatsByRole: any;
  constructor() {}

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


    const buildStatsByRole = heroes => {
      const kills = reduce((accum, hero) => add(accum, pathOr(0, ['combatLifetimeStatistic', 'eliminations'], hero)), 0, heroes);
      const deaths = reduce((accum, hero) => add(accum, pathOr(0, ['combatLifetimeStatistic', 'deaths'], hero)), 0, heroes);
      const wins = reduce((accum, hero) => add(accum, pathOr(0, ['gameHistoryStatistic', 'gamesWon'], hero)), 0, heroes);
      const timePlayed = reduce((accum, hero) => add(accum, pathOr(0, ['gameHistoryStatistic', 'timePlayed'], hero)), 0, heroes);
      return { kills, deaths, wins, timePlayed, KDratio: divide(kills, deaths).toFixed(2), name: path(['hero', 'role'], head(heroes)) };
    };

    this.heroes = groupBy(path<string>(['hero', 'role']), path<any[]>([this.modeIndicator.mode, 'heroSnapshotStatistics'], this.profile));

    this.heroStatsByRole = values(map(buildStatsByRole, this.heroes));

  }
}
