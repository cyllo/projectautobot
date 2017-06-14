import { Component, Input } from '@angular/core';
import { SnapshotStats } from '../../../models';

@Component({
  selector: 'ow-lifetime-stats',
  templateUrl: 'lifetime-stats.component.html',
  styleUrls: [ 'lifetime-stats.component.scss' ]
})

export class LifetimeStatsComponent {
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
  tables: Array<any>;

  constructor() {}

  load() {
    this.resetTables();

    let ss   = this._snapshotStats;
    let ahss = ss.allHeroesSnapshotStatistic;
    let ghs  = ahss.gameHistoryStatistic;
    let cls  = ahss.combatLifetimeStatistic;
    let mas  = ahss.matchAwardsStatistic;

    let add     = this.addToTable;
    let success = this.success;
    let cfs     = this.calcTotalFromSnapshot.bind(this);

    let value;

    // ----------------------------------------------------

    let table_overview = this.addTable('Overview', this.tables);

    value = mas.totalMedals;
    if (success(value)) {
      add('Medals', value, table_overview);
    }

    value = ghs.gamesPlayed;
    if (success(value)) {
      add('Games Played', value, table_overview);
    }

    value = ghs.gamesWon;
    if (success(value)) {
      add('Games Won', value, table_overview);
    }

    value = ghs.timePlayed;
    if (success(value)) {
      add('Total Game Time', value, table_overview);
    }

    value = ( (ghs.timePlayed / ghs.gamesPlayed) / 60 ).toFixed(2);
    if (success(value)) {
      add('Average Game Length', value + ' mins', table_overview);
    }

    // ----------------------------------------------------

    let table_combat = this.addTable('Combat', this.tables);

    value = cls.eliminations;
    if (success(value)) {
      add('Eliminations', value, table_combat);
    }

    value = cls.deaths;
    if (success(value)) {
      add('Deaths', value, table_combat);
    }

    value = (cls.finalBlows / cls.deaths).toFixed(2);
    if (success(value)) {
      add('K/D Ratio', value + ':1', table_combat);
    }

    let shotsHit   = cfs(ss, 'combatLifetimeStatistic', 'shotsHit');
    let shotsFired = cfs(ss, 'combatLifetimeStatistic', 'shotsFired');

    value = ((shotsHit / shotsFired) * 100).toFixed(2);
    if (success(value)) {
      add('Accuracy', value + '%', table_combat);
    }

    value = cls.damageDone;
    if (success(value)) {
      add('Damage Done', value, table_combat);
    }

    value = cls.damageBlocked;
    if (success(value)) {
      add('Damage Blocked', value, table_combat);
    }

    value = cls.healingDone;
    if (success(value)) {
      add('Healing Done', value, table_combat);
    }

  }

  success(value: number) {
    return value !== null && !isNaN(value) && isFinite(value);
  }

  resetTables() {
    this.tables = [];
  }

  addTable(title: string, arr_tables: Array<any>): any {
    let table = {
      title: title,
      data: []
    };
    arr_tables.push(table);
    return table;
  }

  addToTable(title: string, value: any, table: any) {
    table.data.push({
      title: title,
      value: value
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

}
