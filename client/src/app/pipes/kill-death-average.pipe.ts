import { Pipe, PipeTransform } from '@angular/core';
import { divide } from 'ramda';

@Pipe({ name: 'owKillDeathAverage' })
export class KillDeathAverage implements PipeTransform {
  transform(kills, deaths) {
    const ratio = Number(divide(Number(kills), Number(deaths)).toFixed(2));
    return isNaN(ratio) ? 0 : ratio;
  }
}
