import { Component, Input, OnInit } from '@angular/core';
import {
  SnapshotStats,
  HeroSnapshotStats,
  CombatLifetimeStats,
  GameHistoryStats,
  MatchAwardsStats,
  OverwatchStaticData
} from '../../../models';
import { OverwatchHeroDataService } from '../../../services';

@Component({
  selector: 'ow-hero-card-header',
  templateUrl: 'hero-card-header.component.html',
  styleUrls: [ 'hero-card-header.component.scss' ]
})

export class HeroCardHeaderComponent implements OnInit {
  @Input()
  set snapshotStats(snapshotStats) {
    if (!snapshotStats) { return; }
    this._snapshotStats = snapshotStats;
  }
  get snapshotStatsp() {
    return this._snapshotStats;
  }

  @Input()
  set heroSnap(heroSnap) {
    if (!heroSnap) { return; }
    this._heroSnap = heroSnap;
    this.load();
  }
  get heroSnap() {
    return this._heroSnap;
  }

  private _heroSnap: HeroSnapshotStats;
  private _snapshotStats: SnapshotStats;
  private heroData: OverwatchStaticData;
  private dataStore: Array<any>;

  constructor(private owHeroData: OverwatchHeroDataService) {
    this.owHeroData.data$.subscribe(
      res => this.heroData = res,
      error => console.log(error)
    );
  }

  ngOnInit() {}

  load() {
    this.createDataStore();
  }

  createDataStore() {

    let store   = this.dataStore = [];
    let put     = this.addToStore;

    let valid   = this.valid;
    // let scoop   = this.calcTotalFromSnapshot.bind(this);

    let hs:     HeroSnapshotStats   = this._heroSnap;
    let hs_cls: CombatLifetimeStats = valid( hs ) ? hs.combatLifetimeStatistic : null;
    let hs_ghs: GameHistoryStats    = valid( hs ) ? hs.gameHistoryStatistic    : null;
    let hs_mas: MatchAwardsStats    = valid( hs ) ? hs.matchAwardsStatistic    : null;

    let ss:      SnapshotStats      = this._snapshotStats;
    let ahs:     HeroSnapshotStats  = valid( ss ) ? ss.allHeroesSnapshotStatistic : null;
    let ahs_ghs: GameHistoryStats   = valid( ss ) ? ahs.gameHistoryStatistic      : null;

    let prop:   string;
    let value:  any;
    let change: number;

    // -----------------------------------------------------

    prop   = 'timePlayedAsPercentage';
    if ( valid( ahs_ghs ) ) {
      value  = valid( ahs_ghs.timePlayed ) ? Math.round( (hs_ghs.timePlayed / ahs_ghs.timePlayed) * 100 ) : 0;
      change = 0;
    }
    put( prop, change, value, store );

    // -----------------------------------------------------

    prop   = 'gamesplayed';
    if ( valid( hs_ghs ) ) {
      value  = valid( hs_ghs.gamesPlayed ) ? hs_ghs.gamesPlayed : 0;
      change = 0;
    }
    put( prop, change, value, store );

    // -----------------------------------------------------

    prop   = 'winrate';
    if ( valid( hs_ghs ) ) {
      value  = valid( hs_ghs.gamesPlayed ) ? (hs_ghs.gamesWon / hs_ghs.gamesPlayed) * 100 : null;
      change = 0;
    }
    put( prop, change, value, store );

    // -----------------------------------------------------

    prop   = 'wins';
    if ( valid( hs_ghs ) ) {
      value  = valid( hs_ghs.gamesWon ) ? hs_ghs.gamesWon : 0;
      change = 0;
    }
    put( prop, change, value, store );

    // -----------------------------------------------------

    prop   = 'loss';
    if ( valid( hs_ghs ) ) {
      value  = valid( hs_ghs , hs_ghs.gamesLost ) ? hs_ghs.gamesLost : 0;
      change = 0;
    }
    put( prop, change, value, store );

    // -----------------------------------------------------

    prop   = 'medals';
    if ( valid( hs_mas ) ) {
      value  = valid( hs_mas.totalMedals ) ? hs_mas.totalMedals : 0;
      change = 0;
    }
    put( prop, change, value, store );

    // -----------------------------------------------------

    prop   = 'medals-gold';
    if ( valid( hs_mas ) ) {
      value  = valid( hs_mas.goldMedals ) ? hs_mas.goldMedals : 0;
      change = 0;
    }
    put( prop, change, value, store );

    // -----------------------------------------------------

    prop   = 'medals-silver';
    if ( valid( hs_mas ) ) {
      value  = valid( hs_mas.silverMedals ) ? hs_mas.silverMedals : 0;
      change = 0;
    }
    put( prop, change, value, store );

    // -----------------------------------------------------

    prop   = 'medals-bronze';
    if ( valid( hs_mas ) ) {
      value  = valid( hs_mas.bronzeMedals ) ? hs_mas.bronzeMedals : 0;
      change = 0;
    }
    put( prop, change, value, store );

    // -----------------------------------------------------

    prop   = 'onfire';
    if ( valid( hs_cls ) ) {
      value  = valid( hs_cls.timeSpentOnFire ) ? hs_cls.timeSpentOnFire : 0;
      change = 0;
    }
    put( prop, change, value, store );

    // -----------------------------------------------------

    prop   = 'onfirePercentage';
    if ( valid( hs_cls , ahs_ghs ) ) {
     let numerator   = valid( hs_cls.timeSpentOnFire  ) ? hs_cls.timeSpentOnFire  : 0;
     let denominator = valid( ahs_ghs.timeSpentOnFire ) ? ahs_ghs.timeSpentOnFire : 0;
     value  = valid( numerator , denominator ) ? Math.round((numerator / denominator) * 100) : 0;
     change = 0;
    }
    put( prop, change, value, store );

  }

  valid(...args) {
    return args.every(e => {
      return e !== null && e;
    });
  }

  addToStore(_prop: string, change: number, value: any, store: Array<any>) {
    store.push( {
      prop: _prop,
      change: change,
      value: value
     } );
  }

  stat(prop: string) {
    return this.dataStore.find(crate => {
      return crate.prop === prop;
    });
  }

  calcTotalFromSnapshot(ss: SnapshotStats, block: string, key: string): number {
    return ss.heroSnapshotStatistics.reduce((acc, hss) => {
      if (this.objHasKey(hss, block)) {
        let obj = hss[block];
        if (this.objHasKey(obj, key)) {
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

  roleToString(id: number) {
    return this.heroData.roles.find(role => {
      return role.id === id;
    }).name;
  }

  isArray(obj): boolean {
    return Array.isArray(obj);
  }

}