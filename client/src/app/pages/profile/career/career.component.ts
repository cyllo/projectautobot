import { Component, Input, OnInit } from '@angular/core';
import { OverwatchHeroDataService } from '../../../services';
import {
  TransformedStats,
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

  private _snapshotStats: TransformedStats;
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

  createOverviewStatBlocks(snapshotStats: TransformedStats): HeroStatBlock[] {
    const { heroesTotalSnapshotStatistic } = snapshotStats;
    return [
      this.createAllHeroesEliminationsPerMinuteStatistic(heroesTotalSnapshotStatistic),
      this.createAllHeroesKDRatioStatistic(heroesTotalSnapshotStatistic),
      this.createAllHeroesDamageDonePerMinuteStatistic(heroesTotalSnapshotStatistic),
      this.createAllHeroesDamageBlockedPerMinuteStatistic(heroesTotalSnapshotStatistic),
      this.createAllHeroesHealingDonePerMinuteStatistic(heroesTotalSnapshotStatistic),
      this.createAllHeroesMedalsPerMinuteStatistic(heroesTotalSnapshotStatistic)
    ];
  }

  createAllHeroesEliminationsPerMinuteStatistic(heroesTotalSnapshotStatistic: HeroSnapshotStats): HeroStatBlock {
    const statName = 'Eliminations';
    if (heroesTotalSnapshotStatistic) {
      const { combatLifetimeStatistic, gameHistoryStatistic } = heroesTotalSnapshotStatistic;
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

  createAllHeroesKDRatioStatistic(heroesTotalSnapshotStatistic: HeroSnapshotStats): HeroStatBlock {
    const statName = 'K/D Ratio';
    if (heroesTotalSnapshotStatistic) {
      const { combatLifetimeStatistic } = heroesTotalSnapshotStatistic;
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

  createAllHeroesDamageDonePerMinuteStatistic(heroesTotalSnapshotStatistic: HeroSnapshotStats): HeroStatBlock {
    const statName = 'Damage';
    if (heroesTotalSnapshotStatistic) {
      const { combatLifetimeStatistic, gameHistoryStatistic } = heroesTotalSnapshotStatistic;
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

  createAllHeroesDamageBlockedPerMinuteStatistic(heroesTotalSnapshotStatistic: HeroSnapshotStats): HeroStatBlock {
    const statName = 'Blocked';
    if (heroesTotalSnapshotStatistic) {
      const { combatLifetimeStatistic, gameHistoryStatistic } = heroesTotalSnapshotStatistic;
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

  createAllHeroesHealingDonePerMinuteStatistic(heroesTotalSnapshotStatistic: HeroSnapshotStats): HeroStatBlock {
    const statName = 'Healing';
    if (heroesTotalSnapshotStatistic) {
      const { combatLifetimeStatistic, gameHistoryStatistic } = heroesTotalSnapshotStatistic;
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

  createAllHeroesMedalsPerMinuteStatistic(heroesTotalSnapshotStatistic: HeroSnapshotStats): HeroStatBlock {
    const statName = 'Medals';
    if (heroesTotalSnapshotStatistic) {
      const { matchAwardsStatistic, gameHistoryStatistic } = heroesTotalSnapshotStatistic;
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


  createAllCombatChartData(snapshotStats: TransformedStats): ChartData {
    const { heroesTotalSnapshotStatistic } = snapshotStats;
    return <ChartData>{
      xAxisLabels: ['Kills', 'Solo Kills', 'Obj. Kills', 'Assists', 'Deaths'],
      datasets: [
        {
          label: 'Combat',
          data: [
            this.createCombatChartAverageKillsData(heroesTotalSnapshotStatistic),
            this.createCombatChartAverageSoloKillsData(heroesTotalSnapshotStatistic),
            this.createCombatChartAverageObjectiveKillsData(heroesTotalSnapshotStatistic),
            this.createCombatChartAverageAssistsData(heroesTotalSnapshotStatistic),
            this.createCombatChartAverageDeathsData(heroesTotalSnapshotStatistic)
          ]
        }
      ],
      chartType: ChartType.polarArea,
      legend: true
    };
  }

  createCombatChartAverageKillsData(heroesTotalSnapshotStatistics: HeroSnapshotStats): number {
    if ( heroesTotalSnapshotStatistics ) {
      const { combatLifetimeStatistic , gameHistoryStatistic } = heroesTotalSnapshotStatistics;
      return this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.finalBlows, gameHistoryStatistic.timePlayed);
    } else {
      return 0;
    }
  }

  createCombatChartAverageSoloKillsData(heroesTotalSnapshotStatistics: HeroSnapshotStats): number {
    if ( heroesTotalSnapshotStatistics ) {
      const { combatLifetimeStatistic , gameHistoryStatistic } = heroesTotalSnapshotStatistics;
      return this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.soloKills, gameHistoryStatistic.timePlayed);
    } else {
      return 0;
    }
  }

  createCombatChartAverageObjectiveKillsData(heroesTotalSnapshotStatistics: HeroSnapshotStats): number {
    if ( heroesTotalSnapshotStatistics ) {
      const { combatLifetimeStatistic , gameHistoryStatistic } = heroesTotalSnapshotStatistics;
      return this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.objectiveKills, gameHistoryStatistic.timePlayed);
    } else {
      return 0;
    }
  }

  createCombatChartAverageAssistsData(heroesTotalSnapshotStatistics: HeroSnapshotStats): number {
    if ( heroesTotalSnapshotStatistics ) {
      const { combatLifetimeStatistic , gameHistoryStatistic } = heroesTotalSnapshotStatistics;
      return this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.offensiveAssists +
        combatLifetimeStatistic.defensiveAssists, gameHistoryStatistic.timePlayed);
    } else {
      return 0;
    }
  }

  createCombatChartAverageDeathsData(heroesTotalSnapshotStatistics: HeroSnapshotStats): number {
    if ( heroesTotalSnapshotStatistics ) {
      const { combatLifetimeStatistic , gameHistoryStatistic } = heroesTotalSnapshotStatistics;
      return this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.deaths, gameHistoryStatistic.timePlayed);
    } else {
      return 0;
    }
  }

  createAllGameChartData(snapshotStats: TransformedStats): ChartData {
    const { heroesTotalSnapshotStatistic } = snapshotStats;
    return {
      xAxisLabels: ['Damage', 'Blocked', 'Healing'],
      datasets: [
        {
          label: 'Game',
          data: [
            this.createGameChartDamageDoneData(heroesTotalSnapshotStatistic),
            this.createGameChartDamageBlockedData(heroesTotalSnapshotStatistic),
            this.createGameChartHealingDoneData(heroesTotalSnapshotStatistic)
          ]
        }
      ],
      chartType: ChartType.polarArea,
      legend: true
    };
  }

  createGameChartDamageDoneData(heroesTotalSnapshotStatistics: HeroSnapshotStats): number {
    if ( heroesTotalSnapshotStatistics ) {
      const { combatLifetimeStatistic , gameHistoryStatistic } = heroesTotalSnapshotStatistics;
      return this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.damageDone, gameHistoryStatistic.timePlayed);
    } else {
      return 0;
    }
  }

  createGameChartDamageBlockedData(heroesTotalSnapshotStatistics: HeroSnapshotStats): number {
    if ( heroesTotalSnapshotStatistics ) {
      const { combatLifetimeStatistic , gameHistoryStatistic } = heroesTotalSnapshotStatistics;
      return this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.damageBlocked, gameHistoryStatistic.timePlayed);
    } else {
      return 0;
    }
  }

  createGameChartHealingDoneData(heroesTotalSnapshotStatistics: HeroSnapshotStats): number {
    if ( heroesTotalSnapshotStatistics ) {
      const { combatLifetimeStatistic , gameHistoryStatistic } = heroesTotalSnapshotStatistics;
      return this.owHeroData.calculateStatPerMinute(combatLifetimeStatistic.healingDone, gameHistoryStatistic.timePlayed);
    } else {
      return 0;
    }
  }

}
