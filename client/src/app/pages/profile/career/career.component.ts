import { Component, Input, OnInit } from '@angular/core';
import { SnapshotStats, HeroSnapshotStats, GameHistoryStats } from '../../../models';

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
  charts: Array<any>;

  constructor() {}

  ngOnInit() {}

  load() {

    this.resetCharts();

    let ss: SnapshotStats       = this._snapshotStats;
    let ahss: HeroSnapshotStats = ss.allHeroesSnapshotStatistic;
    let ghs: GameHistoryStats   = ahss.gameHistoryStatistic;

    let cfs = this.calcTotalFromSnapshot.bind(this);

    let kills:      number = cfs(ss, 'combatAverageStatistic', 'finalBlowsAverage');
    let elims:      number = cfs(ss, 'combatAverageStatistic', 'eliminationsAverage');
    let objKills:   number = cfs(ss, 'combatAverageStatistic', 'objectiveKillsAverage');
    let soloKills:  number = cfs(ss, 'combatAverageStatistic', 'soloKillsAverage');
    let offAssists: number = cfs(ss, 'combatAverageStatistic', 'offensiveAssistsAverage');
    let defAssists: number = cfs(ss, 'combatAverageStatistic', 'defensiveAssistsAverage');
    let damage:     number = cfs(ss, 'combatAverageStatistic', 'damageDoneAverage');
    let blocked:    number = cfs(ss, 'combatAverageStatistic', 'damageBlockedAverage');
    let healing:    number = cfs(ss, 'combatAverageStatistic', 'healingDoneAverage');
    let timeplayed: number = ghs.timePlayed / 60;

    let chart_combat = this.addChart('Combat', 'radar', false, this.charts);

    this.addLabelsToChart(chart_combat, 'Eliminations', 'Kills', 'Solo Kills', 'Obj. Kills', 'Off. Assists', 'Def. Assists');
    this.addToChart(chart_combat, 'tag',
      elims      / timeplayed,  // Eliminations
      kills      / timeplayed,  // Kills
      soloKills  / timeplayed,  // Solo Kills
      objKills   / timeplayed,  // Objective Kills
      offAssists / timeplayed,  // Offensive Assists
      defAssists / timeplayed); // Defensive Assists

    let chart_game = this.addChart('Game', 'radar', false, this.charts);

    this.addLabelsToChart(chart_game, 'Damage', 'Blocked', 'Healing');
    this.addToChart(chart_game, 'tag',
      damage  / timeplayed,  // Damage Done
      blocked / timeplayed,  // Damage Blocked
      healing / timeplayed); // Healing Done
  }

  addChart(title: string, type: String, legend: boolean, charts_array: Array<any>): any {
    let chart: any = {
      chartTitle: title,
      chartType: type,
      xAxisLabels: [],
      datasets: [],
      legend: legend
    };
    charts_array.push(chart);
    return chart;
  }

  resetCharts() {
    this.charts = [];
  }

  addLabelsToChart(chart: any, ...args) {
    chart.xAxisLabels = args;
  }

  addToChart(chart: any, label: string, ...args) {
    chart.datasets.push({
      data: args,
      label: label
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
