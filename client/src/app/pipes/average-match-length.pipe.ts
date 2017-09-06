import { Pipe, PipeTransform } from '@angular/core';
import { divide } from 'ramda';

@Pipe({ name: 'owAverageMatchLength' })
export class AverageMatchLength implements PipeTransform {
  transform(seconds: number, matches: number) {
    return Math.ceil(divide(seconds, matches));
  }
}
