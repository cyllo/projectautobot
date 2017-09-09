import { Pipe, PipeTransform } from '@angular/core';
import { divide } from 'ramda';

@Pipe({ name: 'owKillDeathAverage' })
export class KillDeathAverage implements PipeTransform {
  transform(kills: number, deaths) {
    return divide(kills, deaths).toFixed(2);
  }
}
