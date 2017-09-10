import { Pipe, PipeTransform } from '@angular/core';
import { divide } from 'ramda';

@Pipe({ name: 'owAverageMatchLength' })
export class AverageMatchLength implements PipeTransform {
  transform(seconds: number, matches: number) {
    const matchLength = Math.ceil(divide(seconds, matches));
    return Number.isFinite(matchLength) ? matchLength : 0;
  }
}
