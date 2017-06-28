import { Component, Input, OnInit } from '@angular/core';
import { OverwatchHeroDataService } from '../../../services';
import {
  SnapshotStats,
  HeroSnapshotStats,
  OverwatchStaticData,
  HeroStatBlock,
  ChartData,
  ChartType
} from '../../../models';

@Component({
  selector: 'ow-career',
  templateUrl: 'career.component.html',
  styleUrls: [ 'career.component.scss' ]
})

export class CareerComponent implements OnInit {
  @Input()
  set snapshotStats(snapshotStats) {
    if (!snapshotStats) { return; }
    this._snapshotStats = snapshotStats;
    this.load();
  }
  get snapshotStats() {
    return this._snapshotStats;
  }

  private _snapshotStats: SnapshotStats;
  private overwatchStaticData: OverwatchStaticData;
  charts: ChartData[];
  statBlocks: HeroStatBlock[];

  constructor(private owHeroData: OverwatchHeroDataService) {}

  ngOnInit() {
    this.owHeroData.data$.subscribe(
      res => this.overwatchStaticData = res,
      error => console.log(error)
    );
  }

  private reset() {
    this.charts = [];
    this.statBlocks = [];
  }

  private load() {
    this.reset();
    this.charts.push(this.createAllCombatChartData(this._snapshotStats));
    this.charts.push(this.createAllGameChartData(this._snapshotStats));
    this.statBlocks = this.createOverviewStatBlocks(this._snapshotStats);
  }

  createOverviewStatBlocks(snapshotStats: SnapshotStats): HeroStatBlock[] {
    const { allHeroesSnapshotStatistic } = snapshotStats;
    return [
      this.createAllHeroesEliminationsPerMinuteStatistic(allHeroesSnapshotStatistic),
      this.createAllHeroesKDRatioStatistic(allHeroesSnapshotStatistic),
      this.createAllHeroesDamageDonePerMinuteStatistic(allHeroesSnapshotStatistic),
      this.createAllHeroesDamageBlockedPerMinuteStatistic(allHeroesSnapshotStatistic),
      this.createAllHeroesHealingDonePerMinuteStatistic(allHeroesSnapshotStatistic),
      this.createAllHeroesMedalsPerMinuteStatistic(allHeroesSnapshotStatistic)
    ];
  }

  createAllHeroesEliminationsPerMinuteStatistic(allHeroesSnapshotStatistic: HeroSnapshotStats): HeroStatBlock {
    const statName = 'Eliminations';
    if (allHeroesSnapshotStatistic) {
      const { combatLifetimeStatistic, gameHistoryStatistic } = allHeroesSnapshotStatistic;
      return {
        name: statName,
        value: this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.eliminations, gameHistoryStatistic.timePlayed),
        format: this.owHeroData.formatToString(0),
        percent: 100
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createAllHeroesKDRatioStatistic(allHeroesSnapshotStatistic: HeroSnapshotStats): HeroStatBlock {
    const statName = 'K/D Ratio';
    if (allHeroesSnapshotStatistic) {
      const { combatLifetimeStatistic } = allHeroesSnapshotStatistic;
      return {
        name: statName,
        value: this.owHeroData.calculateStatRatio(combatLifetimeStatistic.finalBlows, combatLifetimeStatistic.deaths),
        format: this.owHeroData.formatToString(2),
        percent: 100
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createAllHeroesDamageDonePerMinuteStatistic(allHeroesSnapshotStatistic: HeroSnapshotStats): HeroStatBlock {
    const statName = 'Damage';
    if (allHeroesSnapshotStatistic) {
      const { combatLifetimeStatistic, gameHistoryStatistic } = allHeroesSnapshotStatistic;
      return {
        name: statName,
        value: this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.damageDone, gameHistoryStatistic.timePlayed),
        format: this.owHeroData.formatToString(0),
        percent: 100
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createAllHeroesDamageBlockedPerMinuteStatistic(allHeroesSnapshotStatistic: HeroSnapshotStats): HeroStatBlock {
    const statName = 'Blocked';
    if (allHeroesSnapshotStatistic) {
      const { combatLifetimeStatistic, gameHistoryStatistic } = allHeroesSnapshotStatistic;
      return {
        name: statName,
        value: this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.damageBlocked, gameHistoryStatistic.timePlayed),
        format: this.owHeroData.formatToString(0),
        percent: 100
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createAllHeroesHealingDonePerMinuteStatistic(allHeroesSnapshotStatistic: HeroSnapshotStats): HeroStatBlock {
    const statName = 'Healing';
    if (allHeroesSnapshotStatistic) {
      const { combatLifetimeStatistic, gameHistoryStatistic } = allHeroesSnapshotStatistic;
      return {
        name: statName,
        value: this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.healingDone, gameHistoryStatistic.timePlayed),
        format: this.owHeroData.formatToString(0),
        percent: 100
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createAllHeroesMedalsPerMinuteStatistic(allHeroesSnapshotStatistic: HeroSnapshotStats): HeroStatBlock {
    const statName = 'Medals';
    if (allHeroesSnapshotStatistic) {
      const { matchAwardsStatistic, gameHistoryStatistic } = allHeroesSnapshotStatistic;
      return {
        name: statName,
        value: this.owHeroData.calculateStatPerMinute(matchAwardsStatistic.totalMedals, gameHistoryStatistic.timePlayed),
        format: this.owHeroData.formatToString(0),
        percent: 100
      };
    } else {
      return {
        name: statName
      };
    }
  }


  createAllCombatChartData(snapshotStats: SnapshotStats): ChartData {
    const { allHeroesSnapshotStatistic } = snapshotStats;
    return <ChartData>{
      xAxisLabels: ['Kills', 'Solo Kills', 'Obj. Kills', 'Assists', 'Deaths'],
      datasets: [
        {
          label: 'Combat',
          data: [
            this.createCombatChartAverageKillsData(allHeroesSnapshotStatistic),
            this.createCombatChartAverageSoloKillsData(allHeroesSnapshotStatistic),
            this.createCombatChartAverageObjectiveKillsData(allHeroesSnapshotStatistic),
            this.createCombatChartAverageAssistsData(allHeroesSnapshotStatistic),
            this.createCombatChartAverageDeathsData(allHeroesSnapshotStatistic)
          ]
        }
      ],
      chartType: ChartType.polarArea,
      legend: true
    };
  }

  createCombatChartAverageKillsData(allHeroesSnapshotStatistics: HeroSnapshotStats): number {
    if ( allHeroesSnapshotStatistics ) {
      const { combatLifetimeStatistic , gameHistoryStatistic } = allHeroesSnapshotStatistics;
      return this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.finalBlows, gameHistoryStatistic.timePlayed);
    } else {
      return 0;
    }
  }

  createCombatChartAverageSoloKillsData(allHeroesSnapshotStatistics: HeroSnapshotStats): number {
    if ( allHeroesSnapshotStatistics ) {
      const { combatLifetimeStatistic , gameHistoryStatistic } = allHeroesSnapshotStatistics;
      return this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.soloKills, gameHistoryStatistic.timePlayed);
    } else {
      return 0;
    }
  }

  createCombatChartAverageObjectiveKillsData(allHeroesSnapshotStatistics: HeroSnapshotStats): number {
    if ( allHeroesSnapshotStatistics ) {
      const { combatLifetimeStatistic , gameHistoryStatistic } = allHeroesSnapshotStatistics;
      return this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.objectiveKills, gameHistoryStatistic.timePlayed);
    } else {
      return 0;
    }
  }

  createCombatChartAverageAssistsData(allHeroesSnapshotStatistics: HeroSnapshotStats): number {
    if ( allHeroesSnapshotStatistics ) {
      const { combatLifetimeStatistic , gameHistoryStatistic } = allHeroesSnapshotStatistics;
      return this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.offensiveAssists +
        combatLifetimeStatistic.defensiveAssists, gameHistoryStatistic.timePlayed);
    } else {
      return 0;
    }
  }

  createCombatChartAverageDeathsData(allHeroesSnapshotStatistics: HeroSnapshotStats): number {
    if ( allHeroesSnapshotStatistics ) {
      const { combatLifetimeStatistic , gameHistoryStatistic } = allHeroesSnapshotStatistics;
      return this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.deaths, gameHistoryStatistic.timePlayed);
    } else {
      return 0;
    }
  }

  createAllGameChartData(snapshotStats: SnapshotStats): ChartData {
    const { allHeroesSnapshotStatistic } = snapshotStats;
    return {
      xAxisLabels: ['Damage', 'Blocked', 'Healing'],
      datasets: [
        {
          label: 'Game',
          data: [
            this.createGameChartDamageDoneData(allHeroesSnapshotStatistic),
            this.createGameChartDamageBlockedData(allHeroesSnapshotStatistic),
            this.createGameChartHealingDoneData(allHeroesSnapshotStatistic)
          ]
        }
      ],
      chartType: ChartType.polarArea,
      legend: true
    };
  }

  createGameChartDamageDoneData(allHeroesSnapshotStatistics: HeroSnapshotStats): number {
    if ( allHeroesSnapshotStatistics ) {
      const { combatLifetimeStatistic , gameHistoryStatistic } = allHeroesSnapshotStatistics;
      return this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.damageDone, gameHistoryStatistic.timePlayed);
    } else {
      return 0;
    }
  }

  createGameChartDamageBlockedData(allHeroesSnapshotStatistics: HeroSnapshotStats): number {
    if ( allHeroesSnapshotStatistics ) {
      const { combatLifetimeStatistic , gameHistoryStatistic } = allHeroesSnapshotStatistics;
      return this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.damageBlocked, gameHistoryStatistic.timePlayed);
    } else {
      return 0;
    }
  }

  createGameChartHealingDoneData(allHeroesSnapshotStatistics: HeroSnapshotStats): number {
    if ( allHeroesSnapshotStatistics ) {
      const { combatLifetimeStatistic , gameHistoryStatistic } = allHeroesSnapshotStatistics;
      return this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.healingDone, gameHistoryStatistic.timePlayed);
    } else {
      return 0;
    }
  }

}
