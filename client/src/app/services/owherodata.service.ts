import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import {
  SnapshotStats,
  HeroSnapshotStats,
  HeroSpecificStats,
  CombatLifetimeStats,
  GameHistoryStats,
  OverwatchStaticData,
  HeroData
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

  // Returns an array of heroes that belong to the specified role.
  getHeroesOfRole(data: OverwatchStaticData, role: number): Array<HeroData> {
      return data.heroes.filter((hero) => {
          return +hero.role === role;
        }
      );
  }

  valid(...args) {
    return args.every(e => {
      return e !== null && e;
    });
  }

  addDataSet(title: string, value: any, percent: number, label: number, arr: Array<any>) {
    arr.push({
      title: title,
      value: value,
      label: this.getLabel(label),
      percent: Math.round(percent * 100)
    });
  }

  aggregateFromSnapshot(ss: SnapshotStats, block: string, key: string): number {
    let arr_hss: Array<HeroSnapshotStats> = ss.heroSnapshotStatistics;
    return arr_hss.reduce((acc, hss) => {
      let exists = this.objHasKey.bind(this);
      if ( exists( hss, block ) ) {
        let obj = hss[block];
        if ( exists( obj, key ) ) {
          acc += +obj[key] || 0;
        }
      }
      return acc;
    }, 0);
  }

  objHasKey(obj: any, key: string): boolean {
    if (obj) {
      let res = Object.keys(obj).find(e => {
        return e === key;
      });
      return (res) ? res.length > 0 : false;
    } else {
      return false;
    }
  }

  getLabel(label: number): string {
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
      default :
        return '';
    }
  }

  genericStats(ss: SnapshotStats, hs: HeroSnapshotStats): Array<any> {
    let data: Array<any> = Array<any>();

    let put       = this.addDataSet.bind(this);
    let scoop     = this.aggregateFromSnapshot.bind(this);
    let valid     = this.valid;

    let ss_hss:     HeroSnapshotStats[]  = valid( ss     ) ? ss.heroSnapshotStatistics      : null;
    let ss_ahs:     HeroSnapshotStats    = valid( ss_hss ) ? ss.allHeroesSnapshotStatistic  : null;
    let ss_ahs_cls: CombatLifetimeStats  = valid( ss_ahs ) ? ss_ahs.combatLifetimeStatistic : null;
    let ss_ahs_ghs: GameHistoryStats     = valid( ss_ahs ) ? ss_ahs.gameHistoryStatistic    : null;

    let hs_cls: CombatLifetimeStats      = valid( hs ) ? hs.combatLifetimeStatistic : null;
    let hs_ghs: GameHistoryStats         = valid( hs ) ? hs.gameHistoryStatistic    : null;

    let hs_timePlayed      = valid( hs_ghs     ) ? hs_ghs.timePlayed      : 0;
    let ss_ahs_timePlayed  = valid( ss_ahs_ghs ) ? ss_ahs_ghs.timePlayed  : 0;

    let hs_gamesPlayed     = valid( hs_ghs     ) ? hs_ghs.gamesPlayed     : 0;
    let ss_ahs_gamesPlayed = valid( ss_ahs_ghs ) ? ss_ahs_ghs.gamesPlayed : 0;

    let title: string;
    let value: any;
    let label: number;
    let weight: number;

    // -----------------------------------------------------

    title  = 'Damage';
    if ( valid( hs_cls , ss_ahs_cls ) ) {
      value  = valid( hs_cls.damageDone , hs_timePlayed ) ? hs_cls.damageDone / hs_timePlayed : 0 ;
      label  = 0;
      weight = valid( hs_cls.damageDone , ss_ahs_cls.damageDone ) ? hs_cls.damageDone / ss_ahs_cls.damageDone : 0;
    }
    put(title, value, weight, label, data);

    // -----------------------------------------------------

    title  = 'Eliminations';
    if ( valid( hs_cls , ss_ahs_cls ) ) {
      value  = valid( hs_cls.eliminations ) ? hs_cls.eliminations / hs_timePlayed : 0 ;
      label  = 0;
      weight = valid( hs_cls.eliminations , ss_ahs_cls.eliminations ) ? hs_cls.eliminations / ss_ahs_cls.eliminations : 0;
    }
    put(title, value, weight, label, data);

    // -----------------------------------------------------

    title  = 'Kills';
    if ( valid( hs_cls , ss_ahs_cls ) ) {
      value  = valid( hs_cls.finalBlows ) ? hs_cls.finalBlows / hs_timePlayed : 0 ;
      label  = 0;
      weight = valid( hs_cls.finalBlows , ss_ahs_cls.finalBlows ) ? hs_cls.finalBlows / ss_ahs_cls.finalBlows : 0;
    }
    put(title, value, weight, label, data);

    // -----------------------------------------------------

    title  = 'K/D/A Ratio';
    if ( valid( hs_cls , ss_ahs_cls ) ) {
      value  = valid( hs_cls.eliminations , hs_cls.deaths ) ? (hs_cls.eliminations / hs_cls.deaths) : 0 ;
      label  = 2;
      weight = valid( hs_cls.eliminations , hs_cls.deaths , ss_ahs_cls.eliminations , ss_ahs_cls.deaths ) ?
                    ( hs_cls.eliminations / hs_cls.deaths ) / ( ss_ahs_cls.eliminations / ss_ahs_cls.deaths ) : 0;
    }
    put(title, value, weight, label, data);

    // -----------------------------------------------------

    title  = 'Obj. Kills';
    if ( valid( hs_cls , ss_ahs_cls ) ) {
      value  = valid( hs_cls.objectiveKills ) ? hs_cls.objectiveKills / hs_timePlayed : 0 ;
      label  = 0;
      weight = valid( hs_cls.objectiveKills , ss_ahs_cls.objectiveKills ) ? hs_cls.objectiveKills / ss_ahs_cls.objectiveKills : 0;
    }
    put(title, value, weight, label, data);

    // -----------------------------------------------------

    title  = 'Obj. Time';
    if ( valid( hs_cls , ss_ahs_cls ) ) {
      value  = valid( hs_cls.objectiveTime ) ? hs_cls.objectiveTime / 60 : 0 ;
      label  = 3;
      weight = valid( hs_cls.objectiveTime , ss_ahs_cls.objectiveTime ) ? hs_cls.objectiveTime / ss_ahs_cls.objectiveTime : 0;
    }
    put(title, value, weight, label, data);

    // -----------------------------------------------------

    title  = 'Accuracy';
    if ( valid( hs_cls ) ) {
      let chocolate: number  = scoop( ss , 'combatLifetimeStatistic' , 'weaponAccuracyPercentage' ) / ss_hss.length;
      value  = valid( hs_cls.weaponAccuracyPercentage ) ? hs_cls.weaponAccuracyPercentage : 0 ;
      label  = 1;
      weight = valid( hs_cls.weaponAccuracyPercentage , chocolate ) ?
                      hs_cls.weaponAccuracyPercentage / chocolate : 0;
    }
    put(title, value, weight, label, data);

    // -----------------------------------------------------

    title  = 'Healing';
    if ( valid( hs_cls , ss_ahs_cls ) ) {
      value  = valid( hs_cls.healingDone , hs_timePlayed ) ? ( hs_cls.healingDone / hs_timePlayed ) : 0 ;
      label  = 0;
      weight = valid( hs_cls.healingDone , ss_ahs_cls ) ? ( hs_cls.healingDone / ss_ahs_cls.healingDone ) : 0;
    }
    put(title, value, weight, label, data);

    // -----------------------------------------------------

    title  = 'Critical Hits';
    if ( valid( hs_cls , ss_ahs_cls ) ) {
      value  = valid( hs_cls.criticalHits , hs_timePlayed ) ? ( hs_cls.criticalHits / hs_timePlayed ) : 0 ;
      label  = 0;
      weight = valid( hs_cls.criticalHits , ss_ahs_cls.criticalHits ) ? ( hs_cls.criticalHits / ss_ahs_cls.criticalHits ) : 0;
    }
    put(title, value, weight, label, data);

    // -----------------------------------------------------

    title  = 'Critical Hits Accuracy';
    if ( valid( hs_cls , ss_ahs_cls ) ) {
      value  = valid( hs_cls.criticalHitsAccuracyPercentage ) ? ( hs_cls.criticalHitsAccuracyPercentage ) : 0 ;
      label  = 1;
      weight = valid( hs_cls.criticalHitsAccuracyPercentage , hs_cls.weaponAccuracyPercentage ) ?
          ( hs_cls.criticalHitsAccuracyPercentage / hs_cls.weaponAccuracyPercentage ) : 0;
    }
    put(title, value, weight, label, data);

    // -----------------------------------------------------

    title  = 'Avg. Game Length';
    if ( valid( hs_ghs , ss_ahs_ghs ) ) {
      value  = valid( hs_timePlayed , hs_gamesPlayed ) ? ( hs_timePlayed / hs_gamesPlayed ) / 60 : 0 ;
      label  = 3;
      weight = valid( hs_timePlayed , hs_gamesPlayed , ss_ahs_timePlayed , ss_ahs_gamesPlayed ) ?
                    ( hs_timePlayed / hs_gamesPlayed ) / ( ss_ahs_timePlayed / ss_ahs_gamesPlayed ) : 0;
    }
    put(title, value, weight, label, data);

    return data;
  }

  heroSpecificStats(ss: SnapshotStats, hs: HeroSnapshotStats) {
    let data: Array<any> = Array<any>();

    let valid = this.valid;
    let put   = this.addDataSet.bind(this);
    let scoop = this.aggregateFromSnapshot.bind(this);

    let hs_cls: CombatLifetimeStats = valid( hs  ) ? hs.combatLifetimeStatistic : null;
    let hs_ghs: GameHistoryStats    = valid( hs  ) ? hs.gameHistoryStatistic    : null;

    let hss: HeroSpecificStats      = valid( hs  ) ? hs.heroSpecificStatistic   : null;
    let stats: any                  = valid( hss ) ? hss.stats                  : null;

    let title: string;
    let value: any;
    let label: number;
    let weight: number;

    let hero: string = hs.hero.code;

    switch (hero) {
      case '0x02E0000000000029' : // Genji

          title  = 'Dragonblades';
          if ( valid( stats , hs_ghs, hs_cls ) ) {
            value  = valid( stats.dragonblades , hs_ghs.gamesPlayed  ) ? stats.dragonblades / hs_ghs.gamesPlayed  : 0;
            label  = 4;
            weight = valid( stats.dragonblades , hs_cls.eliminations ) ? stats.dragonblades / hs_cls.eliminations : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Dragonblade Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.dragonbladeKills , hs_ghs.gamesPlayed ) ? stats.dragonbladeKills / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.dragonbladeKills , hs_cls.finalBlows ) ? stats.dragonbladeKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Dragonblade Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.dragonbladeKills , hs_ghs.timePlayed ) ? stats.dragonbladeKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.dragonbladeKills , hs_cls.finalBlows ) ? stats.dragonbladeKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          let damageBlocked = scoop( ss , 'combatLifetimeStatistic' , 'damageBlocked' );

          title  = 'Damage Reflected';
          if ( valid( stats , hs_ghs ) ) {
            value  = valid( stats.damageReflected , hs_ghs.timePlayed ) ? stats.damageReflected / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.damageReflected , damageBlocked )     ? stats.damageReflected / damageBlocked     : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E0000000000042' : // McCree

          title  = 'Deadeye';
          if ( valid( stats , hs_ghs, hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Deadeye Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.deadeyeKills , hs_ghs.gamesPlayed ) ? stats.deadeyeKills / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.deadeyeKills , hs_cls.finalBlows ) ? stats.deadeyeKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Deadeye Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.deadeyeKills , hs_ghs.timePlayed ) ? stats.deadeyeKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.deadeyeKills , hs_cls.finalBlows ) ? stats.deadeyeKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Fan The Hammer Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.fanTheHammerKills , hs_ghs.timePlayed ) ? stats.fanTheHammerKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.fanTheHammerKills , hs_cls.finalBlows ) ? stats.fanTheHammerKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E0000000000008' : // Pharah

          title  = 'Barrages';
          if ( valid( stats , hs_ghs, hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Barrage Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.barrageKills , hs_ghs.gamesPlayed ) ? stats.barrageKills / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.barrageKills , hs_cls.finalBlows ) ? stats.barrageKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Barrage Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.barrageKills , hs_ghs.timePlayed ) ? stats.barrageKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.barrageKills , hs_cls.finalBlows ) ? stats.barrageKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Rocket Direct Hits';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.rocketDirectHits , hs_ghs.timePlayed ) ? stats.rocketDirectHits / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.rocketDirectHits , hs_cls.finalBlows ) ? stats.rocketDirectHits / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E0000000000002' : // Reaper

          title  = 'Death Blossoms';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Death Blossom Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.deathsBlossomKills , hs_ghs.gamesPlayed ) ? stats.deathsBlossomKills / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.deathsBlossomKills , hs_cls.finalBlows ) ? stats.deathsBlossomKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Death Blossom Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.deathsBlossomKills , hs_ghs.timePlayed ) ? stats.deathsBlossomKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.deathsBlossomKills , hs_cls.finalBlows ) ? stats.deathsBlossomKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Souls Consumed Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.soulsConsumed , hs_ghs.timePlayed ) ? stats.soulsConsumed / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.soulsConsumed , hs_cls.finalBlows ) ? stats.soulsConsumed / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E000000000006E' : // Soldier: 76

          title  = 'Tactical Visors';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Tactical Visor Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.tacticalVisorKills , hs_ghs.gamesPlayed ) ? stats.tacticalVisorKills / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.tacticalVisorKills , hs_cls.finalBlows ) ? stats.tacticalVisorKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Tactical Visor Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.tacticalVisorKills , hs_ghs.timePlayed ) ? stats.tacticalVisorKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.tacticalVisorKills , hs_cls.finalBlows ) ? stats.tacticalVisorKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Biotic Fields Deployed';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.bioticFieldsDeployed , hs_ghs.timePlayed  ) ? stats.bioticFieldsDeployed / hs_ghs.timePlayed  : 0;
            label  = 0;
            weight = valid( stats.bioticFieldsDeployed , hs_cls.healingDone ) ? stats.bioticFieldsDeployed / hs_cls.healingDone : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Biotic Field Healing Done';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.bioticFieldHealingDone , hs_ghs.timePlayed  ) ? stats.bioticFieldHealingDone / hs_ghs.timePlayed  : 0;
            label  = 0;
            weight = valid( stats.bioticFieldHealingDone , hs_cls.healingDone ) ? stats.bioticFieldHealingDone / hs_cls.healingDone : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E000000000012E' : // Sombra

          title  = 'EMP';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Enemies EMP\'d';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.enemiesEmpd , hs_ghs.gamesPlayed ) ? stats.enemiesEmpd / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.enemiesEmpd , hs_cls.finalBlows ) ? stats.enemiesEmpd / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Enemies EMP\'d';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.enemiesEmpd , hs_ghs.gamesPlayed ) ? stats.enemiesEmpd / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.enemiesEmpd , hs_cls.finalBlows ) ? stats.enemiesEmpd / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Enemies Hacked';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.enemiesHacked , hs_ghs.gamesPlayed ) ? stats.enemiesHacked / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.enemiesHacked , hs_cls.finalBlows ) ? stats.enemiesHacked / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E0000000000003' : // Tracer

          title  = 'Pulse Bombs';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Pulse Bomb Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.pulseBombKills , hs_ghs.gamesPlayed ) ? stats.pulseBombKills / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.pulseBombKills , hs_cls.finalBlows ) ? stats.pulseBombKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Pulse Bomb Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.pulseBombKills , hs_ghs.timePlayed ) ? stats.pulseBombKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.pulseBombKills , hs_cls.finalBlows ) ? stats.pulseBombKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Pulse Bombs Attached';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.pulseBombsAttached , hs_ghs.timePlayed ) ? stats.pulseBombsAttached / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.pulseBombsAttached , hs_cls.finalBlows ) ? stats.pulseBombsAttached / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E0000000000015' : // Bastion

          title  = 'Configuration: Tank';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Tank Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.tankKills , hs_ghs.gamesPlayed ) ? stats.tankKills / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.tankKills , hs_cls.finalBlows ) ? stats.tankKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Tank Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.tankKills , hs_ghs.timePlayed ) ? stats.tankKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.tankKills , hs_cls.finalBlows ) ? stats.tankKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Sentry Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.sentryKills , hs_ghs.timePlayed ) ? stats.sentryKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.sentryKills , hs_cls.finalBlows ) ? stats.sentryKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Recon Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.reconKills , hs_ghs.timePlayed ) ? stats.reconKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.reconKills , hs_cls.finalBlows ) ? stats.reconKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

        break;
      case '0x02E0000000000005' : // Hanzo

          title  = 'Dragonstrikes';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Dragonstrike Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.dragonstrikeKills , hs_ghs.gamesPlayed ) ? stats.dragonstrikeKills / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.dragonstrikeKills , hs_cls.finalBlows ) ? stats.dragonstrikeKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Dragonstrike Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.dragonstrikeKills , hs_ghs.timePlayed ) ? stats.dragonstrikeKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.dragonstrikeKills , hs_cls.finalBlows ) ? stats.dragonstrikeKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Scatter Arrow Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.scatterArrowKills , hs_ghs.timePlayed ) ? stats.scatterArrowKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.scatterArrowKills , hs_cls.finalBlows ) ? stats.scatterArrowKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E0000000000065' : // Junkrat

          title  = 'Riptires';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Riptire Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.riptireKills , hs_ghs.gamesPlayed ) ? stats.riptireKills / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.riptireKills , hs_cls.finalBlows ) ? stats.riptireKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Riptire Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.riptireKills , hs_ghs.timePlayed ) ? stats.riptireKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.riptireKills , hs_cls.finalBlows ) ? stats.riptireKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Enemies Trapped';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.enemiesTrapped , hs_ghs.gamesPlayed ) ? stats.enemiesTrapped / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.enemiesTrapped , hs_cls.finalBlows ) ? stats.enemiesTrapped / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Enemies Trapped';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.enemiesTrapped , hs_ghs.timePlayed ) ? stats.enemiesTrapped / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.enemiesTrapped , hs_cls.finalBlows ) ? stats.enemiesTrapped / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E00000000000DD' : // Mei

        title  = 'Blizzards';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Blizzard Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.blizzardKills , hs_ghs.gamesPlayed ) ? stats.blizzardKills / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.blizzardKills , hs_cls.finalBlows ) ? stats.blizzardKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Blizzard Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.blizzardKills , hs_ghs.timePlayed ) ? stats.blizzardKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.blizzardKills , hs_cls.finalBlows ) ? stats.blizzardKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Enemies Frozen';
          if ( valid( stats , hs_ghs, hs_cls ) ) {
            value  = valid( stats.enemiesFrozen , hs_ghs.gamesPlayed  ) ? stats.enemiesFrozen / hs_ghs.gamesPlayed  : 0;
            label  = 4;
            weight = valid( stats.enemiesFrozen , hs_cls.eliminations ) ? stats.enemiesFrozen / hs_cls.eliminations : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E0000000000006' : // Torbjorn

          title  = 'Molten Cores';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Molten Cores Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid ( stats.moltenCoreKills , hs_ghs.timePlayed ) ? stats.moltenCoreKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.moltenCoreKills , hs_cls.finalBlows ) ? stats.moltenCoreKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Molten Cores Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid ( stats.moltenCoreKills , hs_ghs.gamesPlayed ) ? stats.moltenCoreKills / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.moltenCoreKills , hs_cls.finalBlows ) ? stats.moltenCoreKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Torbjörn Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid ( stats.torbjörnKills , hs_ghs.gamesPlayed ) ? stats.torbjörnKills / hs_ghs.gamesPlayed : 0;
            label  = 0;
            weight = valid( stats.torbjörnKills , hs_cls.finalBlows ) ? stats.torbjörnKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Turret Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid ( stats.turretsKills , hs_ghs.timePlayed ) ? stats.turretsKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.turretsKills , hs_cls.finalBlows ) ? stats.turretsKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Armor Packs Created';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid ( stats.armorPacksCreated , hs_ghs.timePlayed ) ? stats.armorPacksCreated / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.armorPacksCreated , hs_cls.offensiveAssists, hs_cls.defensiveAssists ) ?
                            stats.armorPacksCreated / ( hs_cls.offensiveAssists + hs_cls.defensiveAssists ) : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E000000000000A' : // Widowmaker

          title  = 'Infra-Sight';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Venom Mine Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid ( stats.venomMineKills , hs_ghs.timePlayed ) ? stats.venomMineKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.venomMineKills , hs_cls.finalBlows ) ? stats.venomMineKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Scoped Critical Hits';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid ( stats.scopedCriticalHits , hs_ghs.gamesPlayed ) ? stats.scopedCriticalHits / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.scopedCriticalHits , hs_cls.finalBlows ) ? stats.moltenCoreKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Scoped Accuracy';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid ( stats.scopedAccuracyPercentage ) ? stats.scopedAccuracyPercentage : 0;
            label  = 1;
            weight = valid( stats.scopedAccuracyPercentage , hs_cls.finalBlows ) ? stats.torbjörnKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E000000000007A' : // D.Va

          title  = 'Self Destructs';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Self Destruct Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.selfdestructKills , hs_ghs.gamesPlayed ) ? stats.selfdestructKills / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.selfdestructKills , hs_cls.finalBlows ) ? stats.selfdestructKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Mech Deaths';
          if ( valid( stats , hs_ghs, hs_cls ) ) {
            value  = valid( stats.mechDeaths , hs_ghs.gamesPlayed  ) ? stats.mechDeaths / hs_ghs.gamesPlayed  : 0;
            label  = 4;
            weight = valid( stats.mechDeaths , hs_cls.deaths ) ? stats.mechDeaths / hs_cls.deaths : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Mechs Called';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.mechsCalled , hs_ghs.timePlayed ) ? stats.mechsCalled / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.mechsCalled , hs_cls.deaths ) ? stats.mechsCalled / hs_cls.deaths : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E000000000013E' : // Orisa

          title  = 'Superchargers';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Damage Amplified';
          if ( valid( stats , hs_cls ) ) {
            value  = valid( stats.damageAmplified , hs_ghs.timePlayed   ) ? stats.damageAmplified / hs_ghs.timePlayed   : 0;
            label  = 0;
            weight = valid( stats.damageAmplified , hs_ghs.gamesPlayed , hs_cls.offensiveAssists ) ?
                          ( stats.damageAmplified / hs_ghs.gamesPlayed ) / hs_cls.offensiveAssists : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E0000000000007' : // Reinhardt

          title  = 'Earthshatters';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Earthshatter Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.earthshatterKills , hs_ghs.gamesPlayed ) ? stats.earthshatterKills / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.earthshatterKills , hs_cls.finalBlows ) ? stats.earthshatterKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Earthshatter Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.earthshatterKills , hs_ghs.timePlayed ) ? stats.earthshatterKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.earthshatterKills , hs_cls.finalBlows ) ? stats.earthshatterKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Charge Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.chargeKills , hs_ghs.timePlayed ) ? stats.chargeKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.chargeKills , hs_cls.finalBlows ) ? stats.chargeKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Firestrike Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.fireStrikeKills , hs_ghs.timePlayed ) ? stats.fireStrikeKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.fireStrikeKills , hs_cls.finalBlows ) ? stats.fireStrikeKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E0000000000040' : // Roadhog

          title  = 'Whole Hogs';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Whole Hogs Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.wholeHogKills , hs_ghs.gamesPlayed ) ? stats.wholeHogKills / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.wholeHogKills , hs_cls.finalBlows ) ? stats.wholeHogKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Whole Hogs Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.wholeHogKills , hs_ghs.timePlayed ) ? stats.wholeHogKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.wholeHogKills , hs_cls.finalBlows ) ? stats.wholeHogKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Enemies Hooked';
          if ( valid( stats , hs_cls ) ) {
            value  = valid( stats.enemiesHooked , hs_ghs.timePlayed   ) ? stats.enemiesHooked / hs_ghs.timePlayed   : 0;
            label  = 0;
            weight = valid( stats.enemiesHooked , hs_cls.eliminations ) ? stats.enemiesHooked / hs_cls.eliminations : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Hook Accuracy';
          if ( valid( stats , hs_cls ) ) {
            value  = valid( stats.hookAccuracyPercentage ) ? stats.hookAccuracyPercentage : 0;
            label  = 1;
            weight = valid( stats.hookAccuracyPercentage , hs_cls.weaponAccuracyPercentage ) ?
                            stats.hookAccuracyPercentage / hs_cls.weaponAccuracyPercentage : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Hooks Attempted';
          if ( valid( stats , hs_ghs ) ) {
            value  = valid( stats.hooksAttempted , hs_ghs.timePlayed   ) ? stats.hooksAttempted / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.hooksAttempted , hs_cls.eliminations ) ? stats.hooksAttempted / hs_cls.eliminations : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E0000000000009' : // Winston

          title  = 'Primal Rages';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Primal Rage Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.primalRageKills , hs_ghs.gamesPlayed ) ?
                            stats.primalRageKills / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.primalRageKills , hs_cls.finalBlows ) ?
                            stats.primalRageKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Primal Rage Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.primalRageKills , hs_ghs.timePlayed ) ?
                            stats.primalRageKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.primalRageKills , hs_cls.finalBlows ) ?
                            stats.primalRageKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Players Knocked Back';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.playersKnockedBack , hs_ghs.timePlayed ) ?
                            stats.playersKnockedBack / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.playersKnockedBack , hs_cls.finalBlows ) ?
                            stats.playersKnockedBack / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Jump Pack Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.jumpPackKills , hs_ghs.timePlayed ) ?
                            stats.jumpPackKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.jumpPackKills , hs_cls.finalBlows ) ?
                            stats.jumpPackKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E0000000000068' : // Zarya

          title  = 'Graviton Surges';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Graviton Surge Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.lifetimeGravitonSurgeKills , hs_ghs.timePlayed ) ?
                            stats.lifetimeGravitonSurgeKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.lifetimeGravitonSurgeKills , hs_cls.finalBlows ) ?
                            stats.lifetimeGravitonSurgeKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Graviton Surge Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.lifetimeGravitonSurgeKills , hs_ghs.gamesPlayed ) ?
                            stats.lifetimeGravitonSurgeKills / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.lifetimeGravitonSurgeKills , hs_cls.finalBlows ) ?
                            stats.lifetimeGravitonSurgeKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'High Energy Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.highEnergyKills , hs_ghs.timePlayed ) ?
                            stats.highEnergyKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.highEnergyKills , hs_cls.finalBlows ) ?
                            stats.highEnergyKills / hs_cls.finalBlows : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Projected Barriers';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.projectedBarriersApplied , hs_ghs.timePlayed ) ?
                            stats.projectedBarriersApplied / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.projectedBarriersApplied , hs_cls.offensiveAssists, hs_cls.defensiveAssists ) ?
                            stats.projectedBarriersApplied / ( hs_cls.offensiveAssists + hs_cls.defensiveAssists ) : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Energy Accummulation';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.lifetimeEnergyAccumulation , hs_ghs.timePlayed ) ?
                            stats.lifetimeEnergyAccumulation / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.lifetimeEnergyAccumulation , stats.energyMaximum , hs_ghs.gamesPlayed ) ?
                          ( stats.lifetimeEnergyAccumulation / hs_ghs.gamesPlayed ) / stats.energyMaximum : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E000000000013B' : // Ana

          title  = 'Nano Boosts';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Nano Boosts Applied';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.nanoBoostsApplied , hs_ghs.gamesPlayed ) ?
                            stats.nanoBoostsApplied / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.nanoBoostsApplied , hs_cls.damageBlocked ) ?
                            stats.nanoBoostsApplied / hs_cls.damageBlocked : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Nano Boosts Applied';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.nanoBoostsApplied , hs_ghs.timePlayed ) ?
                            stats.nanoBoostsApplied / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.nanoBoostsApplied , hs_cls.damageBlocked ) ?
                            stats.nanoBoostsApplied / hs_cls.damageBlocked : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Nano Boosts Assists';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.nanoBoostAssists , hs_ghs.timePlayed ) ?
                            stats.nanoBoostAssists / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.nanoBoostAssists , hs_cls.damageBlocked ) ?
                            stats.nanoBoostAssists / hs_cls.damageBlocked : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Enemies Slept';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.enemiesSlept , hs_ghs.timePlayed ) ?
                            stats.enemiesSlept / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.enemiesSlept , hs_cls.damageBlocked ) ?
                            stats.enemiesSlept / hs_cls.damageBlocked : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Scoped Accuracy';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.scopedAccuracyPercentage ) ?
                            stats.scopedAccuracyPercentage : 0;
            label  = 1;
            weight = valid( stats.scopedAccuracyPercentage , hs_cls.damageBlocked ) ?
                            stats.scopedAccuracyPercentage / hs_cls.damageBlocked : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Unscoped Accuracy';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.unscopedAccuracy ) ?
                            stats.unscopedAccuracy : 0;
            label  = 1;
            weight = valid( stats.unscopedAccuracy , hs_cls.damageBlocked ) ?
                            stats.unscopedAccuracy / hs_cls.damageBlocked : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E0000000000079' : // Lucio

          title  = 'Sound Barriers';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Sound Barriers';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.soundBarriersProvided , hs_ghs.timePlayed ) ?
                            stats.soundBarriersProvided / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.soundBarriersProvided , hs_cls.damageBlocked ) ?
                            stats.soundBarriersProvided / hs_cls.damageBlocked : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E0000000000004' : // Mercy

        title  = 'Resurrects';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Players Resurrected';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.playersResurrected , hs_ghs.gamesPlayed ) ?
                            stats.playersResurrected / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.playersResurrected , hs_cls.damageBlocked ) ?
                            stats.playersResurrected / hs_cls.damageBlocked : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Players Resurrected';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.playersResurrected , hs_ghs.timePlayed ) ?
                            stats.playersResurrected / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.playersResurrected , hs_cls.damageBlocked ) ?
                            stats.playersResurrected / hs_cls.damageBlocked : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Blaster Kills';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.blasterKills , hs_ghs.timePlayed ) ?
                            stats.blasterKills / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.blasterKills , hs_cls.damageBlocked ) ?
                            stats.blasterKills / hs_cls.damageBlocked : 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Damage Amplified';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.damageAmplified , hs_ghs.timePlayed ) ?
                            stats.damageAmplified / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.damageAmplified , hs_cls.damageBlocked ) ?
                            stats.damageAmplified / hs_cls.damageBlocked : 0;
          }
          put(title, value, weight, label, data);

        break;
      case '0x02E0000000000016' : // Symmetra

          title  = 'Teleporters';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Teleporter Uptime';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.teleporterUptime , hs_ghs.gamesPlayed ) ?
                            stats.teleporterUptime / hs_ghs.gamesPlayed : 0;
            label  = 4;
            weight = valid( stats.teleporterUptime ,  hs_ghs.gamesPlayed , hs_cls.defensiveAssists ) ?
                            ( stats.teleporterUptime / hs_ghs.gamesPlayed ) / hs_cls.defensiveAssists : 0;
          }
          put(title, value, weight, label, data);


        break;
      case '0x02E0000000000020' : // Zenyatta

          title  = 'Transcendence';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = 0;
            label  = 4;
            weight = 0;
          }
          put(title, value, weight, label, data);

          // -----------------------------------------------------

          title  = 'Transcendence Healing';
          if ( valid( stats , hs_ghs , hs_cls ) ) {
            value  = valid( stats.transcendenceHealing , hs_ghs.timePlayed ) ?
                            stats.transcendenceHealing / hs_ghs.timePlayed : 0;
            label  = 0;
            weight = valid( stats.transcendenceHealing , hs_cls.healingDone ) ?
                            stats.lifetimeGravitonSurgeKills / hs_cls.healingDone : 0;
          }
          put(title, value, weight, label, data);

        break;
      default :
        console.log('Requested specific data for unknown hero: ', hero);
        return null;
    }

    return data;
  }

}
