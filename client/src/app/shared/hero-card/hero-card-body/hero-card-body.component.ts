import { Component, Input, OnInit } from '@angular/core';
import {
  SnapshotStats,
  HeroSnapshotStats,
  CombatLifetimeStats,
  GameHistoryStats,
  OverwatchStaticData
} from '../../../models';
import { OverwatchHeroDataService } from '../../../services';

@Component({
  selector: 'ow-hero-card-body',
  templateUrl: 'hero-card-body.component.html',
  styleUrls: [ 'hero-card-body.component.scss' ]
})

export class HeroCardBodyComponent implements OnInit {
  @Input()
  set snapshotStats(snapshotStats) {
    if (!snapshotStats) { return; }
    this._snapshotStats = snapshotStats;
  }
  get snapshotStats() {
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
  warehouse: Array<any>;

  constructor(private owHeroData: OverwatchHeroDataService) {
    this.owHeroData.data$.subscribe(
      res => this.heroData = res,
      error => console.log(error)
    );
  }

  ngOnInit() {}

  load() {

    this.warehouse = [];

    let warehouse = this.warehouse;
    let put       = this.addCrate.bind(this);
    let scoop     = this.calcTotalFromSnapshot.bind(this);
    let valid     = this.valid;

    let ss:         SnapshotStats        = this._snapshotStats;
    let ss_hss:     HeroSnapshotStats[]  = ss.heroSnapshotStatistics;
    let ss_ahs:     HeroSnapshotStats    = ss.allHeroesSnapshotStatistic;
    let ss_ahs_cls: CombatLifetimeStats  = ss_ahs.combatLifetimeStatistic;
    let ss_ahs_ghs: GameHistoryStats     = ss_ahs.gameHistoryStatistic;

    let hs:     HeroSnapshotStats        = this._heroSnap;
    let hs_cls: CombatLifetimeStats      = hs.combatLifetimeStatistic;
    let hs_ghs: GameHistoryStats         = hs.gameHistoryStatistic;

    let hs_timePlayed   = valid( hs_ghs     ) ? hs_ghs.timePlayed      : 0;
    let ahs_timePlayed  = valid( ss_ahs_ghs ) ? ss_ahs_ghs.timePlayed  : 0;

    let hs_gamesPlayed  = valid( hs_ghs     ) ? hs_ghs.gamesPlayed     : 0;
    let ahs_gamesPlayed = valid( ss_ahs_ghs ) ? ss_ahs_ghs.gamesPlayed : 0;

    let title: string;
    let value: any;
    let label: number;
    let weight: number;

    console.log('hs: ', hs, 'ss: ', ss);

    // -----------------------------------------------------

    title  = 'Eliminations';
    if ( valid( hs_cls , ss_ahs_cls ) ) {
      value  = valid( hs_cls , hs_cls.eliminations ) ? hs_cls.eliminations / hs_timePlayed : 0 ;
      label  = 0;
      weight = valid( hs_cls.eliminations , ss_ahs_cls.eliminations ) ? hs_cls.eliminations / ss_ahs_cls.eliminations : 0;
    }
    put(title, value, weight, label, warehouse);

    // -----------------------------------------------------

    title  = 'Kills';
    if ( valid( hs_cls , ss_ahs_cls ) ) {
      value  = valid( hs_cls , hs_cls.finalBlows ) ? hs_cls.finalBlows / hs_timePlayed : 0 ;
      label  = 0;
      weight = valid( hs_cls.finalBlows , ss_ahs_cls.finalBlows ) ? hs_cls.finalBlows / ss_ahs_cls.finalBlows : 0;
    }
    put(title, value, weight, label, warehouse);

    // -----------------------------------------------------

    title  = 'K/D/A Ratio';
    if ( valid( hs_cls , ss_ahs_cls ) ) {
      value  = valid( hs_cls.eliminations , hs_cls.deaths ) ? (hs_cls.eliminations / hs_cls.deaths) : 0 ;
      label  = 2;
      weight = valid( hs_cls.eliminations , hs_cls.deaths , ss_ahs_cls.eliminations , ss_ahs_cls.deaths ) ?
                    (hs_cls.eliminations / hs_cls.deaths) / (ss_ahs_cls.eliminations / ss_ahs_cls.deaths) : 0;
    }
    put(title, value, weight, label, warehouse);

    // -----------------------------------------------------

    title  = 'Accuracy';
    if ( valid( hs_cls ) ) {

      let n: number  = scoop( ss , 'combatLifetimeStatistic' , 'weaponAccuracyPercentage' ) / ss_hss.length;

      value  = valid( hs_cls.weaponAccuracyPercentage ) ? hs_cls.weaponAccuracyPercentage : 0 ;
      label  = 1;
      weight = valid( hs_cls.weaponAccuracyPercentage , n ) ?
                      hs_cls.weaponAccuracyPercentage / n : 0;
    }
    put(title, value, weight, label, warehouse);

    // -----------------------------------------------------

    title  = 'Avg. Game Length';
    if ( valid( hs_ghs , ss_ahs_ghs ) ) {
      value  = valid( hs_timePlayed , hs_gamesPlayed ) ? ( hs_timePlayed / hs_gamesPlayed ) / 60 : 0 ;
      label  = 3;
      weight = valid( hs_timePlayed , hs_gamesPlayed , ahs_timePlayed , ahs_gamesPlayed ) ?
                    ( hs_timePlayed / hs_gamesPlayed ) / ( ahs_timePlayed / ahs_gamesPlayed ) : 0;
    }
    put(title, value, weight, label, warehouse);

    // -----------------------------------------------------

  }

  valid(...args) {
    return args.every(e => {
      return e !== null && e;
    });
  }

  addCrate(title: string, value: any, weight: number, label: number, warehouse: Array<any>) {
    warehouse.push({
      brand: title,
      value: value,
      label: this.getLabel(label),
      weight: Math.round(weight * 100)
    });
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
        return 'min(s)';
      default :
        return '';
    }
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

  heroSpecificData(code: string): Array<any> {
    let data: Array<any>;
    switch (code) {
      case '0x02E0000000000029' : // Genji
        return data;
      case '0x02E0000000000042' : // McCree
        return data;
      case '0x02E0000000000008' : // Pharah
        return data;
      case '0x02E0000000000002' : // Reaper
        return data;
      case '0x02E000000000006E' : // Soldier: 76
        return data;
      case '0x02E000000000012E' : // Sombra
        return data;
      case '0x02E0000000000003' : // Tracer
        return data;
      case '0x02E0000000000015' : // Bastion
        return data;
      case '0x02E0000000000005' : // Hanzo
        return data;
      case '0x02E0000000000065' : // Junkrat
        return data;
      case '0x02E00000000000DD' : // Mei
        return data;
      case '0x02E0000000000006' : // Torbjorn
        return data;
      case '0x02E000000000000A' : // Widowmaker
        return data;
      case '0x02E000000000007A' : // D.Va
        return data;
      case '0x02E000000000013E' : // Orisa
        return data;
      case '0x02E0000000000007' : // Reinhardt
        return data;
      case '0x02E0000000000040' : // Roadhog
        return data;
      case '0x02E0000000000009' : // Winston
        return data;
      case '0x02E0000000000009' : // Zarya
        return data;
      case '0x02E000000000013B' : // Ana
        return data;
      case '0x02E0000000000079' : // Lucio
        return data;
      case '0x02E0000000000004' : // Mercy
        return data;
      case '0x02E0000000000016' : // Symmetra
        return data;
      case '0x02E0000000000020' : // Zenyatta
        return data;
      default :
        return data; // hero not handled
    }
  }

}
