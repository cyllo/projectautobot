import { Pipe, PipeTransform } from '@angular/core';
import { divide } from 'ramda';

@Pipe({ name: 'owRatio' })
export class RatioPipe implements PipeTransform {
  transform(a, b) {
    const ratio = Number(divide(Number(a), Number(b)).toFixed(2));
    return isNaN(ratio) ? 0 : ratio;
  }
}
