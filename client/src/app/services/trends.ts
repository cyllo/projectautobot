import { Injectable } from '@angular/core';
import { map, divide } from 'ramda';
import { DatePipe } from '@angular/common';
// this service needs to be pulled into a "trends" module along with the trends component after it has been reworked to
// be generic enough to be reusable between the hero/profile pages.

@Injectable()
export class TrendsService {
  constructor(private datePipe: DatePipe) {}


  skillRating (trends) {
    return map(({ insertedAt, profileSnapshotStatistic: { profileStatistic: { competitiveLevel } } }) => {
      return { name: this.datePipe.transform(insertedAt, 'MM-dd HH:mm'), value: parseInt(competitiveLevel, 10).toFixed(2) };
    }, trends);
  }

  eliminations (trends) {
    return map(({ insertedAt, heroesTotalSnapshotStatistic: { gameAverageStatistic: { eliminationsAvgPer10Min } } }) => {
      return { name: this.datePipe.transform(insertedAt, 'MM-dd HH:mm'), value: parseInt(eliminationsAvgPer10Min, 10).toFixed(2) };
    }, trends);
  }

  kdRatio (trends) {
    return map(({ insertedAt, heroesTotalSnapshotStatistic: { gameAverageStatistic: { eliminationsAvgPer10Min, deathsAvgPer10Min } } }) => {
      const kdRatio = divide(parseInt(eliminationsAvgPer10Min), parseInt(deathsAvgPer10Min));
      const value = isNaN(kdRatio) ? 0 : kdRatio;
      return { name: this.datePipe.transform(insertedAt, 'MM-dd HH:mm'), value };
    }, trends);
  }

  accuracy (trends) {
    return map(({ insertedAt, heroesTotalSnapshotStatistic: { combatBestStatistic: { weaponAccuracyBestInGamePercentage } } }) => {
      return {
        name: this.datePipe.transform(insertedAt, 'MM-dd HH:mm'),
        value: parseInt(weaponAccuracyBestInGamePercentage, 10).toFixed(2)
      };
    }, trends);
  }

  damageDone (trends) {
    return map(({ insertedAt, heroesTotalSnapshotStatistic: { gameAverageStatistic: { allDamageDoneAvgPer10Min } } }) => {
      return { name: this.datePipe.transform(insertedAt, 'MM-dd HH:mm'), value: parseInt(allDamageDoneAvgPer10Min, 10).toFixed(2) };
    }, trends);
  }

  damageBlocked (trends) {
    return map(({ insertedAt, heroesTotalSnapshotStatistic: { gameAverageStatistic: { damageBlockedAvgPer10Min } } }) => {
      return { name: this.datePipe.transform(insertedAt, 'MM-dd HH:mm'), value: parseInt(damageBlockedAvgPer10Min, 10).toFixed(2) };
    }, trends);
  }

  healingDone (trends) {
    return map(({ insertedAt, heroesTotalSnapshotStatistic: { gameAverageStatistic: { damageBlockedAvgPer10Min } } }) => {
      return { name: this.datePipe.transform(insertedAt, 'MM-dd HH:mm'), value: parseInt(damageBlockedAvgPer10Min, 10).toFixed(2) };
    }, trends);
  }

  winRate (trends) {
    return map(({ insertedAt, heroesTotalSnapshotStatistic: { gameHistoryStatistic: { winPercentage } } }) => {
      return { name: this.datePipe.transform(insertedAt, 'MM-dd HH:mm'), value: parseInt(winPercentage, 10).toFixed(2) };
    }, trends);
  }
}
