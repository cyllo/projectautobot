import { Component, Input, OnInit } from '@angular/core';
import { SnapshotStats } from '../../../models';
// import { SnapshotStats, HeroSnapshotStats, CombatAverageStats, MatchAwardsStats } from '../../../models';

@Component({
  selector: 'ow-career',
  templateUrl: 'career.component.html',
  styleUrls: [ 'career.component.scss' ]
})

export class CareerComponent implements OnInit {
  _snapshotStats: SnapshotStats;

  combatOverviewChartData: Array<any> = [{
    chartTitle: 'Combat',
    xAxisLabels: [],
    datasets: []
  }];

  gameOverviewChartData: Array<any> = [{
    chartTitle: 'Game',
    xAxisLabels: [],
    datasets: []
  }];

  constructor() {}

  @Input()
  set snapshotStats(snapshotStats) {
    if (!snapshotStats) {
      return;
    }
    this._snapshotStats = snapshotStats;
  }

  get snapshotStats() {
    return this._snapshotStats;
  }

  ngOnInit() {

    let _timePlayedInMins  = this._snapshotStats.allHeroesSnapshotStatistic.gameHistoryStatistic.timePlayed / 60;

    // console.log(this._snapshotStats);
    // This portrion of the data is calculated this way because on playoverwatch.com the 'All Heroes'
    // tab does not show all stat types. For eg: Damage Blocked does not exist on the 'All Heroes' tab even
    // if you have played a champion like Reinhardt that has a Damaged Blocked value. So the function
    // calTotalFromSnapshot() was created to do the aggregate manually.
    let kills: number            = this.calcTotalFromSnapshot(this._snapshotStats, 'combatAverageStatistic', 'finalBlowsAverage');
    let eliminations: number     = this.calcTotalFromSnapshot(this._snapshotStats, 'combatAverageStatistic', 'eliminationsAverage');
    let objKills: number         = this.calcTotalFromSnapshot(this._snapshotStats, 'combatAverageStatistic', 'objectiveKillsAverage');
    let soloKills: number        = this.calcTotalFromSnapshot(this._snapshotStats, 'combatAverageStatistic', 'soloKillsAverage');
    let timeonfire: number       = this.calcTotalFromSnapshot(this._snapshotStats, 'combatAverageStatistic', 'timeSpentOnFireAverage');
    // let deaths: number           = this.calcTotalFromSnapshot(this._snapshotStats, 'combatAverageStatistic', 'deathsAverage');
    let offensiveAssists: number = this.calcTotalFromSnapshot(this._snapshotStats, 'combatAverageStatistic', 'offensiveAssistsAverage');
    let defensiveAssists: number = this.calcTotalFromSnapshot(this._snapshotStats, 'combatAverageStatistic', 'defensiveAssistsAverage');

    // console.log(kills, offensiveAssists, defensiveAssists, damageDone, damageBlocked, healingDone);
    this.combatOverviewChartData[0].xAxisLabels = ['Eliminations', 
    'kills', 'Solo Kills', 'Obj. Kills', 'On Fire', 'Off. Assists', 'Def. Assists'];
    this.combatOverviewChartData[0].datasets.push({
      data: [eliminations     / _timePlayedInMins,
             kills            / _timePlayedInMins,
             soloKills        / _timePlayedInMins,
             objKills         / _timePlayedInMins,
             timeonfire       / _timePlayedInMins,
             offensiveAssists / _timePlayedInMins,
             defensiveAssists / _timePlayedInMins],
      label: 'You'
    });

    let damageDone: number     = this.calcTotalFromSnapshot(this._snapshotStats, 'combatAverageStatistic', 'damageDoneAverage');
    let damageBlocked: number  = this.calcTotalFromSnapshot(this._snapshotStats, 'combatAverageStatistic', 'damageBlockedAverage');
    let healingDone: number    = this.calcTotalFromSnapshot(this._snapshotStats, 'combatAverageStatistic', 'healingDoneAverage');
    this.gameOverviewChartData[0].xAxisLabels = ['Damage', 'Blocked', 'Healing'];
    this.gameOverviewChartData[0].datasets.push({
      data: [damageDone / _timePlayedInMins,
            damageBlocked / _timePlayedInMins,
            healingDone / _timePlayedInMins],
      label: 'You'
    });

  }

  calcTotalFromSnapshot(ss: SnapshotStats, statType: string, key: string): number {
    return ss.heroSnapshotStatistics.reduce((acc, hss) => {
      if (this.objHasKey(hss, statType)) {
        let obj = hss[statType];
        if (this.objHasKey(obj, key)) {
          acc += +obj[key] || 0;
        }
      }
      return acc;
    }, 0);
  }

  objHasKey(obj: any, key: string): Boolean {
    return Object.keys(obj).find(e => {
      return e === key;
    }).length > 0;
  }

}
