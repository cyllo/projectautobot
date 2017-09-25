import { Pipe, PipeTransform } from '@angular/core';
import { divide } from 'ramda';

@Pipe({ name: 'owTotalTimeOnFire' })
export class TotalTimeOnFire implements PipeTransform {
  transform(timeOnFire: number, timePlayed: number) {
    const matchLength = Math.ceil(divide(timeOnFire, timePlayed));
    return Number.isFinite(matchLength) ? matchLength : 0;
  }
}
