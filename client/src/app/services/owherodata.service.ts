import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import {
  SnapshotStats,
  HeroSnapshotStats,
  OverwatchStaticData,
  HeroData,
  HeroStatBlock
} from '../models';

@Injectable()
export class OverwatchHeroDataService {
  private _data$ = new ReplaySubject<OverwatchStaticData> ();
  data$: Observable<OverwatchStaticData>;

  constructor(private http: Http) {}

  load() {
    if (this.data$) { return; }
    this.data$ = this._data$.asObservable();
    this.http.get('/lib/overwatch.json')
      .map(res => res.json())
      .subscribe(this._data$);
  }

  formatToString(label: number): string {
    switch (label) {
      case 0 :
        return '/min';
      case 1 :
        return '%';
      case 2 :
        return ':1';
      case 3:
        return 'mins';
      case 4:
        return '/game';
      case 5:
        return 'mins/game';
      default :
        return '';
    }
  }

  // Returns an array of hero data (Descriptive information about a hero) from the
  // JSON that contains all heroes that belong to the specified role.
  heroDataByRole(data: OverwatchStaticData, role: number): HeroData[] {
    return data.heroes.filter((hero) => {
      return +hero.role === role;
    });
  }

  // Returns the value provided if it is a finite number otherwise zero.
  numOrZero(num: any): number {
    return Number.isFinite(num) ? num : 0;
  }

  // Returns a number that is the accumulation of the value of the key in every
  // hero snapshot where it exists.
  aggregateFromSnapshot(snapshotStatistics: SnapshotStats, statSectionKey: string, heroStatKey: string): number {
    const { heroSnapshotStatistics } = snapshotStatistics;
    return heroSnapshotStatistics.reduce((acc, heroStatistics) => {
      if ( heroStatistics[statSectionKey] ) {
        const obj: any = heroStatistics[statSectionKey];
        acc += ( obj && obj[heroStatKey] ) ? +obj[heroStatKey] : 0;
      }
      return acc;
    }, 0);
  }

  // Returns true if the object has the key provided
  objHasKey(obj: any, key: string): boolean {
    return Object.keys(obj).find((e) => {
      return e === key;
    }).length > 0;
  }

  // Returns the stat provided as a per minute value
  calculateStatPerMinute(stat: number, timePlayedInSeconds: number): number {
    if ( stat && timePlayedInSeconds ) {
      const timePlayedInMinutes = timePlayedInSeconds / 60;
      return Number(this.numOrZero( stat / timePlayedInMinutes ).toFixed(2));
    } else {
      return 0;
    }
  }

  calculateStatPerGame(stat: number, gamesPlayed: number): number {
    if ( stat && gamesPlayed ) {
      return Number(this.numOrZero( stat / gamesPlayed ).toFixed(2));
    } else {
      return 0;
    }
  }

  calculateStatRatio(numerator: number, denominator: number): number {
    if ( numerator && denominator ) {
      return Number(this.numOrZero( numerator / denominator ).toFixed(2));
    } else {
      return 0;
    }
  }

  calculateStatTimePerMinutePerGame(time: number, gamesPlayed: number): number {
    if ( time && gamesPlayed ) {
      return Number(this.numOrZero( (time / gamesPlayed) / 60 ).toFixed(2));
    } else {
      return 0;
    }
  }

  calculateStatAverage(stat: number, gamesPlayed: number): number {
    if ( stat && gamesPlayed ) {
      return Number(this.numOrZero( stat / gamesPlayed ).toFixed(2));
    } else {
      return 0;
    }
  }

  // Returns the percentage of stat a in comparison to stat b
  calculateStatPercentage(a: number, b: number): number {
    if ( a && b ) {
      return Math.round(this.numOrZero(a / b * 100));
    } else {
      return 0;
    }
  }

  // Returns an array of statistics that are common to each hero.
  genericStatBlocksForHero(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createDamageDoneStatistic(heroSnap, allHeroSnapStats),
      this.createEliminationsStatistic(heroSnap, allHeroSnapStats),
      this.createKillsStatistic(heroSnap, allHeroSnapStats),
      this.createObjectiveKillsStatistic(heroSnap, allHeroSnapStats),
      this.createObjectiveTimeStatistic(heroSnap, allHeroSnapStats),
      this.createKDARatioStatistic(heroSnap, allHeroSnapStats),
      this.createAccuracyStatistic(heroSnap, allHeroSnapStats),
      this.createHealingDoneStatistic(heroSnap, allHeroSnapStats),
      this.createCriticalHitsStatistic(heroSnap, allHeroSnapStats),
      this.createCriticalHitsAccuracyStatistic(heroSnap, allHeroSnapStats),
      this.createAverageGameLengthStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  // ------ GENERIC HERO STAT BLOCKS ------

  createDamageDoneStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { combatLifetimeStatistic , gameHistoryStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Damage';
    if ( combatLifetimeStatistic && gameHistoryStatistic && allHeroesCombatLifetimeStats ) {
      return {
        name: statName,
        value: this.calculateStatPerMinute(combatLifetimeStatistic.damageDone, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(combatLifetimeStatistic.damageDone, allHeroesCombatLifetimeStats.damageDone)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createEliminationsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { combatLifetimeStatistic , gameHistoryStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Eliminations';
    if ( combatLifetimeStatistic && gameHistoryStatistic && allHeroesCombatLifetimeStats ) {
      return {
        name: statName,
        value: this.calculateStatPerMinute(combatLifetimeStatistic.eliminations, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(combatLifetimeStatistic.eliminations, allHeroesCombatLifetimeStats.eliminations)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { combatLifetimeStatistic , gameHistoryStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Kills';
    if ( combatLifetimeStatistic && gameHistoryStatistic && allHeroesCombatLifetimeStats ) {
      return {
        name: statName,
        value: this.calculateStatPerMinute(combatLifetimeStatistic.finalBlows, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(combatLifetimeStatistic.finalBlows, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createObjectiveKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { combatLifetimeStatistic , gameHistoryStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Obj. Kills';
    if ( combatLifetimeStatistic && gameHistoryStatistic && allHeroesCombatLifetimeStats ) {
      return {
        name: statName,
        value: this.calculateStatPerMinute(combatLifetimeStatistic.objectiveKills, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(combatLifetimeStatistic.objectiveKills, allHeroesCombatLifetimeStats.objectiveKills)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createObjectiveTimeStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { combatLifetimeStatistic , gameHistoryStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Obj. Time';
    if ( combatLifetimeStatistic && gameHistoryStatistic && allHeroesCombatLifetimeStats ) {
      return {
        name: statName,
        value: this.calculateStatTimePerMinutePerGame(combatLifetimeStatistic.objectiveTime, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(5),
        percent: this.calculateStatPercentage(combatLifetimeStatistic.objectiveTime, allHeroesCombatLifetimeStats.objectiveTime)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createKDARatioStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { combatLifetimeStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'KDA Ratio';
    if ( combatLifetimeStatistic && allHeroesCombatLifetimeStats ) {
      return {
        name: statName,
        value: this.calculateStatRatio(combatLifetimeStatistic.eliminations, combatLifetimeStatistic.deaths),
        format: this.formatToString(2),
        percent: this.calculateStatPercentage(combatLifetimeStatistic.eliminations / combatLifetimeStatistic.deaths,
          allHeroesCombatLifetimeStats.eliminations / allHeroesCombatLifetimeStats.deaths)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createAccuracyStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { combatLifetimeStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Accuracy';
    if ( combatLifetimeStatistic && allHeroesCombatLifetimeStats ) {
      return {
        name: statName,
        value: this.calculateStatPercentage(combatLifetimeStatistic.shotsHit, combatLifetimeStatistic.shotsFired),
        format: this.formatToString(1),
        percent: this.calculateStatPercentage(combatLifetimeStatistic.shotsHit / combatLifetimeStatistic.shotsFired,
          allHeroesCombatLifetimeStats.shotsHit / allHeroesCombatLifetimeStats.shotsFired)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createHealingDoneStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { combatLifetimeStatistic , gameHistoryStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Healing Done';
    if ( combatLifetimeStatistic && gameHistoryStatistic && allHeroesCombatLifetimeStats ) {
      return {
        name: statName,
        value: this.calculateStatPerMinute(combatLifetimeStatistic.healingDone, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(combatLifetimeStatistic.healingDone, allHeroesCombatLifetimeStats.healingDone)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createCriticalHitsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { combatLifetimeStatistic , gameHistoryStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Crits';
    if ( combatLifetimeStatistic && gameHistoryStatistic && allHeroesCombatLifetimeStats ) {
      return {
        name: statName,
        value: this.calculateStatPerMinute(combatLifetimeStatistic.criticalHits, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(combatLifetimeStatistic.criticalHits, allHeroesCombatLifetimeStats.criticalHits)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createCriticalHitsAccuracyStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { combatLifetimeStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Crit Accuracy';
    if ( combatLifetimeStatistic && allHeroesCombatLifetimeStats ) {
      return {
        name: statName,
        value: this.numOrZero(combatLifetimeStatistic.criticalHitsAccuracyPercentage),
        format: this.formatToString(1),
        percent: this.calculateStatPercentage(combatLifetimeStatistic.criticalHitsAccuracyPercentage,
          allHeroesCombatLifetimeStats.criticalHitsAccuracyPercentage)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createAverageGameLengthStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic } = heroSnap;
    const allHeroesGameHistoryStatistic = allHeroSnapStats.gameHistoryStatistic;
    const statName = 'Avg Game Length';
    if ( gameHistoryStatistic && allHeroesGameHistoryStatistic ) {
      return {
        name: statName,
        value: this.calculateStatAverage(gameHistoryStatistic.timePlayed / 60, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(5),
        percent: this.calculateStatPercentage(gameHistoryStatistic.timePlayed / gameHistoryStatistic.gamesPlayed,
          allHeroesGameHistoryStatistic.timePlayed / allHeroesGameHistoryStatistic.gamesPlayed)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // ------ HERO SPECIFIC STAT BLOCKS ------

  heroSpecificStatBlocksForHero(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    switch (heroSnap.hero.code) {
      case '0x02E0000000000029' : // Genji
        return this.createAllGenjiHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E0000000000042' : // McCree
        return this.createAllMcCreeHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E0000000000008' : // Pharah
        return this.createAllPharahHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E0000000000002' : // Reaper
        return this.createAllReaperHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E000000000006E' : // Soldier: 76
        return this.createAllSoldier76HeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E000000000012E' : // Sombra
        return this.createAllSombraHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E0000000000003' : // Tracer
        return this.createAllTracerHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E0000000000015' : // Bastion
        return this.createAllBastionHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E0000000000005' : // Hanzo
        return this.createAllHanzoHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E0000000000065' : // Junkrat
        return this.createAllJunkratHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E00000000000DD' : // Mei
        return this.createAllMeiHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E0000000000006' : // Torbjorn
        return this.createAllTorbjornHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E000000000000A' : // Widowmaker
        return this.createAllWidowmakerHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E000000000007A' : // D.Va
        return this.createAllDVaHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E000000000013E' : // Orisa
        return this.createAllOrisaHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E0000000000007' : // Reinhardt
        return this.createAllReinhardtHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E0000000000040' : // Roadhog
        return this.createAllRoadhogHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E0000000000009' : // Winston
        return this.createAllWinstonHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E0000000000068' : // Zarya
        return this.createAllZaryaHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E000000000013B' : // Ana
        return this.createAllAnaHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E0000000000079' : // Lucio
        return this.createAllLucioHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E0000000000004' : // Mercy
        return this.createAllMercyHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E0000000000016' : // Symmetra
        return this.createAllSymmetraHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      case '0x02E0000000000020' : // Zenyatta
        return this.createAllZenyattaHeroSpecificStatistics(heroSnap, allHeroSnapStats);
      default:
        return [];
    }
  }

  // Genji
  createAllGenjiHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createGenjiDragonbladesStatistic(heroSnap, allHeroSnapStats),
      this.createGenjiDragonbladeKillsStatistic(heroSnap, allHeroSnapStats),
      this.createGenjiDamageReflectedStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createGenjiDragonbladesStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    allHeroSnapStats = allHeroSnapStats || null;
    const { gameHistoryStatistic , heroSpecificStatistic } = heroSnap;
    const statName = 'Dragonblades';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.dragonblades , gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(1, 1)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createGenjiDragonbladeKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic , heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Damage Reflected';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.dragonbladeKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.dragonbladeKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createGenjiDamageReflectedStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic , heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Damage Reflected';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.damageReflected, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(stats.damageReflected, allHeroesCombatLifetimeStats.damageBlocked)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // McCree
  createAllMcCreeHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createMcCreeDeadEyeKillsStatistic(heroSnap, allHeroSnapStats),
      this.createMcCreeFanTheHammerStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createMcCreeDeadEyeKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Deadeye Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.deadeyeKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.deadeyeKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createMcCreeFanTheHammerStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Fan The Hammer Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.fanTheHammerKills, gameHistoryStatistic.timePlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.fanTheHammerKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Pharah
  createAllPharahHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createPharahBarrageKillsStatistic(heroSnap, allHeroSnapStats),
      this.createPharahRocketDirectHitsStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createPharahBarrageKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Barrage Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.barrageKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.barrageKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createPharahRocketDirectHitsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Rocket Direct Hits';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.rocketDirectHits, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(stats.rocketDirectHits, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Reaper
  createAllReaperHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createReaperDeathBlossomKillsStatistic(heroSnap, allHeroSnapStats),
      this.createReaperSoulsConsumedStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createReaperDeathBlossomKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Death Blossom Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.deathsBlossomKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.deathsBlossomKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createReaperSoulsConsumedStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    allHeroSnapStats = allHeroSnapStats || <HeroSnapshotStats>{}; // stops tslint error
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const statName = 'Souls Consumed';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.soulsConsumed, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(1, 1)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Soldier: 76
  createAllSoldier76HeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createSoldier76TacticalVisorKillsStatistic(heroSnap, allHeroSnapStats),
      this.createSoldier76BioticFieldsDeployedStatistic(heroSnap, allHeroSnapStats),
      this.createSoldier76BioticFieldHealingDoneStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createSoldier76TacticalVisorKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Tactical Visor Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.tacticalVisorKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.tacticalVisorKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createSoldier76BioticFieldsDeployedStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    allHeroSnapStats = allHeroSnapStats || <HeroSnapshotStats>{}; // stops tslint error
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const statName = 'Biotic Fields Deployed';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.bioticFieldsDeployed, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(1, 1)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createSoldier76BioticFieldHealingDoneStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Biotic Field Healing Done';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.bioticFieldHealingDone, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(stats.bioticFieldHealingDone, allHeroesCombatLifetimeStats.healingDone)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Sombra
  createAllSombraHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createSombraEnemiesEMPDStatistic(heroSnap, allHeroSnapStats),
      this.createSombraEnemiesHackedStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createSombraEnemiesEMPDStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Enemies EMP\'d';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.enemiesEmpd, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.enemiesEmpd,
          allHeroesCombatLifetimeStats.offensiveAssists + allHeroesCombatLifetimeStats.defensiveAssists)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createSombraEnemiesHackedStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Enemies Hacked';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.enemiesHacked, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.enemiesHacked,
          allHeroesCombatLifetimeStats.offensiveAssists + allHeroesCombatLifetimeStats.defensiveAssists)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Tracer
  createAllTracerHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createTracerPulseBombKillsStatistic(heroSnap, allHeroSnapStats),
      this.createTracerPulseBombsAttachedStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createTracerPulseBombKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Pulse Bomb Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.pulseBombKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.pulseBombKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createTracerPulseBombsAttachedStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    allHeroSnapStats = allHeroSnapStats || <HeroSnapshotStats>{}; // stops tslint error
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const statName = 'Pulse Bombs Attached';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.pulseBombsAttached, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(1, 1)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Bastion
  createAllBastionHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createBastionTankKillsStatistic(heroSnap, allHeroSnapStats),
      this.createBastionSentryKillsStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createBastionTankKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Tank Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.tankKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.tankKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createBastionSentryKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Sentry Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.sentryKills, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(stats.sentryKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createBastionReconKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Recon Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.reconKills, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(stats.reconKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Hanzo
  createAllHanzoHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createHanzoDragonstrikeKillsStatistic(heroSnap, allHeroSnapStats),
      this.createHanzoScatterArrowKillsStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createHanzoDragonstrikeKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Dragonstrike Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.dragonstrikeKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.dragonstrikeKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createHanzoScatterArrowKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Scatter Arrow Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.scatterArrowKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.scatterArrowKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Junkrat
  createAllJunkratHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createJunkratRiptireKillsStatistic(heroSnap, allHeroSnapStats),
      this.createJunkratEnemiesTrappedStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createJunkratRiptireKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Riptire Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.riptireKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.riptireKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createJunkratEnemiesTrappedStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Enemies Trapped';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.enemiesTrapped, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(stats.enemiesTrapped,
          allHeroesCombatLifetimeStats.offensiveAssists + allHeroesCombatLifetimeStats.defensiveAssists)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Mei
  createAllMeiHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createMeiBlizzardKillsStatistic(heroSnap, allHeroSnapStats),
      this.createMeiEnemiesFrozenStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createMeiBlizzardKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Blizzard Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.blizzardKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.blizzardKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createMeiEnemiesFrozenStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Enemies Frozen';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.enemiesFrozen, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(stats.blizzardKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Torbjorn
  createAllTorbjornHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createTorbjornMoltenCoreKillsStatistic(heroSnap, allHeroSnapStats),
      this.createTorbjornKillsStatistic(heroSnap, allHeroSnapStats),
      this.createTorbjornTurretKillsStatistic(heroSnap, allHeroSnapStats),
      this.createTorbjornArmorPacksCreatedStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createTorbjornMoltenCoreKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Molten Cores Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.moltenCoreKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.moltenCoreKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createTorbjornKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Torbjörn Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.torbjörnKills, gameHistoryStatistic.timePlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.torbjörnKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createTorbjornTurretKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Turret Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.turretsKills, gameHistoryStatistic.timePlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.turretsKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createTorbjornArmorPacksCreatedStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Armor Packs Created';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.armorPacksCreated, gameHistoryStatistic.timePlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.armorPacksCreated,
          allHeroesCombatLifetimeStats.offensiveAssists + allHeroesCombatLifetimeStats.defensiveAssists)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Widowmaker
  createAllWidowmakerHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createWidowmakerVenomMineKillsStatistic(heroSnap, allHeroSnapStats),
      this.createWidowmakerScopedCriticalHitsStatistic(heroSnap, allHeroSnapStats),
      this.createWidowmakerScopedAccuracyStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createWidowmakerVenomMineKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Venom Mine Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.venomMineKills, gameHistoryStatistic.timePlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.venomMineKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createWidowmakerScopedCriticalHitsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Scoped Critical Hits';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.scopedCriticalHits, gameHistoryStatistic.timePlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.scopedCriticalHits, allHeroesCombatLifetimeStats.criticalHits)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createWidowmakerScopedAccuracyStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Scoped Accuracy';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.numOrZero(stats.scopedAccuracyPercentage),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.scopedAccuracyPercentage,
          allHeroesCombatLifetimeStats.weaponAccuracyPercentage)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // D.Va
  createAllDVaHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createDVaSelfDestructKillsKillsStatistic(heroSnap, allHeroSnapStats),
      this.createDVaMechsCalledStatistic(heroSnap),
      this.createDVaMechDeathsStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createDVaSelfDestructKillsKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Self Destruct Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.selfdestructKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.selfdestructKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createDVaMechsCalledStatistic(heroSnap: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const statName = 'Mechs Called';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.mechsCalled, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.mechsCalled, stats.mechsCalled)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createDVaMechDeathsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Mech Deaths';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.mechDeaths, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.mechDeaths, allHeroesCombatLifetimeStats.deaths)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Orisa
  createAllOrisaHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createOrisaDamageAmplifiedStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createOrisaDamageAmplifiedStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Damage Amplified';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.damageAmplified, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(stats.damageAmplified, allHeroesCombatLifetimeStats.damageDone)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Reinhardt
  createAllReinhardtHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createReinhardtEarthshatterKillsStatistic(heroSnap, allHeroSnapStats),
      this.createReinhardtChargeKillsStatistic(heroSnap, allHeroSnapStats),
      this.createReinhardtFirestrikeKillsStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createReinhardtEarthshatterKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Earthshatter Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.earthshatterKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.earthshatterKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createReinhardtChargeKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Charge Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.chargeKills, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(stats.chargeKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createReinhardtFirestrikeKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Firestrike Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.fireStrikeKills, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(stats.fireStrikeKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Roadhog
  createAllRoadhogHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createRoadhogWholeHogKillsStatistic(heroSnap, allHeroSnapStats),
      this.createRoadhogEnemiesHookedStatistic(heroSnap, allHeroSnapStats),
      this.createRoadhogHookAccuracyStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createRoadhogWholeHogKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Whole Hogs Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.wholeHogKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.wholeHogKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createRoadhogEnemiesHookedStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Enemies Hooked';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.enemiesHooked, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(stats.enemiesHooked, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createRoadhogHookAccuracyStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    allHeroSnapStats = allHeroSnapStats || null; // stops tslint error
    const { heroSpecificStatistic } = heroSnap;
    const statName = 'Hook Accuracy';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.numOrZero(stats.hookAccuracyPercentage),
        format: this.formatToString(1),
        percent: this.calculateStatPercentage(1, 1)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Winston
  createAllWinstonHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createWinstonPrimalRageKillsStatistic(heroSnap, allHeroSnapStats),
      this.createWinstonPlayersKnockedBackStatistic(heroSnap, allHeroSnapStats),
      this.createWinstonJumpPackKillsStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createWinstonPrimalRageKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Primal Rage Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.primalRageKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.primalRageKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createWinstonPlayersKnockedBackStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Players Knocked Back';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.playersKnockedBack, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.playersKnockedBack, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createWinstonJumpPackKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Jump Pack Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.jumpPackKills, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(stats.jumpPackKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Zarya
  createAllZaryaHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createZaryaGravitonSurgeKillsStatistic(heroSnap, allHeroSnapStats),
      this.createZaryaHighEnergyKillsStatistic(heroSnap, allHeroSnapStats),
      this.createZaryaProjectedBarriersStatistic(heroSnap, allHeroSnapStats),
      this.createZaryaEnergyAccummulationStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createZaryaGravitonSurgeKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Graviton Surge Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.lifetimeGravitonSurgeKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.lifetimeGravitonSurgeKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createZaryaHighEnergyKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'High Energy Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.highEnergyKills, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.highEnergyKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createZaryaProjectedBarriersStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Projected Barriers';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.projectedBarriersApplied, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(stats.projectedBarriersApplied,
          allHeroesCombatLifetimeStats.offensiveAssists + allHeroesCombatLifetimeStats.defensiveAssists)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createZaryaEnergyAccummulationStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    allHeroSnapStats = allHeroSnapStats || null; // stops tslint error
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const statName = 'Energy Accummulation';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.lifetimeEnergyAccumulation, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(1, 1)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Ana
  createAllAnaHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createAnaNanoBoostsAppliedStatistic(heroSnap, allHeroSnapStats),
      this.createAnaNanoBoostsAssistsStatistic(heroSnap, allHeroSnapStats),
      this.createAnaEnemiesSleptStatistic(heroSnap, allHeroSnapStats),
      this.createAnaScopedAccuracytatistic(heroSnap, allHeroSnapStats),
      this.createAnaUnScopedAccuracytatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createAnaNanoBoostsAppliedStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Nano Boosts Applied';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.nanoBoostsApplied, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.nanoBoostsApplied, allHeroesCombatLifetimeStats.offensiveAssists)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createAnaNanoBoostsAssistsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Nano Boosts Assists';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.nanoBoostAssists, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.nanoBoostAssists,
          allHeroesCombatLifetimeStats.offensiveAssists + allHeroesCombatLifetimeStats.defensiveAssists)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createAnaEnemiesSleptStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Enemies Slept';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.enemiesSlept, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(stats.enemiesSlept,
          allHeroesCombatLifetimeStats.offensiveAssists + allHeroesCombatLifetimeStats.defensiveAssists)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createAnaScopedAccuracytatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Scoped Accuracy';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.numOrZero(stats.scopedAccuracyPercentage),
        format: this.formatToString(1),
        percent: this.calculateStatPercentage(stats.scopedAccuracyPercentage, allHeroesCombatLifetimeStats.weaponAccuracyPercentage)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createAnaUnScopedAccuracytatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Unscoped Accuracy';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.numOrZero(stats.unscopedAccuracy),
        format: this.formatToString(1),
        percent: this.calculateStatPercentage(stats.unscopedAccuracy, allHeroesCombatLifetimeStats.weaponAccuracyPercentage)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Lucio
  createAllLucioHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createLucioSoundBarriersStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createLucioSoundBarriersStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Sound Barriers';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.soundBarriersProvided, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.soundBarriersProvided,
          allHeroesCombatLifetimeStats.offensiveAssists)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Mercy
  createAllMercyHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createMercyPlayersResurrectedStatistic(heroSnap, allHeroSnapStats),
      this.createMercyBlasterKillsStatistic(heroSnap, allHeroSnapStats),
      this.createMercyDamageAmplifiedStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createMercyPlayersResurrectedStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Players Resurrected';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.playersResurrected, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.playersResurrected,
          allHeroesCombatLifetimeStats.offensiveAssists + allHeroesCombatLifetimeStats.defensiveAssists)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createMercyBlasterKillsStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Blaster Kills';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.blasterKills, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(stats.blasterKills, allHeroesCombatLifetimeStats.finalBlows)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createMercyDamageAmplifiedStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Damage Amplified';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerMinute(stats.damageAmplified, gameHistoryStatistic.timePlayed),
        format: this.formatToString(0),
        percent: this.calculateStatPercentage(stats.damageAmplified, allHeroesCombatLifetimeStats.offensiveAssists)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  // Symmetra
  createAllSymmetraHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createSymmetraTeleporterUptimeStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createSymmetraTeleporterUptimeStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    allHeroSnapStats = allHeroSnapStats || null;
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const statName = 'Teleporter Uptime';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.teleporterUptime, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.teleporterUptime, stats.timePlayed)
      };
    } else {
      return {
        name: statName
      };
    }
  }

  createAllZenyattaHeroSpecificStatistics(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock[] {
    return [
      this.createZenyattaTranscendenceHealingStatistic(heroSnap, allHeroSnapStats)
    ];
  }

  createZenyattaTranscendenceHealingStatistic(heroSnap: HeroSnapshotStats, allHeroSnapStats: HeroSnapshotStats): HeroStatBlock {
    const { gameHistoryStatistic, heroSpecificStatistic } = heroSnap;
    const allHeroesCombatLifetimeStats = allHeroSnapStats.combatLifetimeStatistic;
    const statName = 'Transcendence Healing';
    if ( heroSpecificStatistic ) {
      const { stats } = heroSpecificStatistic;
      return {
        name: statName,
        value: this.calculateStatPerGame(stats.transcendenceHealing, gameHistoryStatistic.gamesPlayed),
        format: this.formatToString(4),
        percent: this.calculateStatPercentage(stats.transcendenceHealing, allHeroesCombatLifetimeStats.healingDone)
      };
    } else {
      return {
        name: statName
      };
    }
  }

}
