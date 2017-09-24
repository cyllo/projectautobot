import { Injectable } from '@angular/core';
import { map, divide } from 'ramda';
import { DatePipe } from '@angular/common';


@Injectable()
export class TrendsService {
  constructor(private datePipe: DatePipe) {}


  skillRating (trends) {
    return map(({ insertedAt, profileSnapshotStatistic: { profileStatistic: { competitiveLevel } } }) => {
      return { name: this.datePipe.transform(insertedAt, 'MM-dd HH:mm'), value: competitiveLevel };
    }, trends);
  }

  eliminations (trends) {
    return map(({ insertedAt, heroesTotalSnapshotStatistic: { gameAverageStatistic: { eliminationsAvgPer10Min } } }) => {
      return { name: this.datePipe.transform(insertedAt, 'MM-dd HH:mm'), value: eliminationsAvgPer10Min };
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
      return { name: this.datePipe.transform(insertedAt, 'MM-dd HH:mm'), value: weaponAccuracyBestInGamePercentage };
    }, trends);
  }

  damageDone (trends) {
    return map(({ insertedAt, heroesTotalSnapshotStatistic: { gameAverageStatistic: { allDamageDoneAvgPer10Min } } }) => {
      return { name: this.datePipe.transform(insertedAt, 'MM-dd HH:mm'), value: allDamageDoneAvgPer10Min };
    }, trends);
  }

  damageBlocked (trends) {
    return map(({ insertedAt, heroesTotalSnapshotStatistic: { gameAverageStatistic: { damageBlockedAvgPer10Min } } }) => {
      return { name: this.datePipe.transform(insertedAt, 'MM-dd HH:mm'), value: damageBlockedAvgPer10Min };
    }, trends);
  }

  healingDone (trends) {
    return map(({ insertedAt, heroesTotalSnapshotStatistic: { gameAverageStatistic: { damageBlockedAvgPer10Min } } }) => {
      return { name: this.datePipe.transform(insertedAt, 'MM-dd HH:mm'), value: damageBlockedAvgPer10Min };
    }, trends);
  }

  winRate (trends) {
    return map(({ insertedAt, heroesTotalSnapshotStatistic: { gameHistoryStatistic: { winPercentage } } }) => {
      return { name: this.datePipe.transform(insertedAt, 'MM-dd HH:mm'), value: winPercentage };
    }, trends);
  }
}
