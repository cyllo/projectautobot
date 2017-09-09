import { Pipe, PipeTransform } from '@angular/core';
import { divide } from 'ramda';
const MINUTE = 60;

@Pipe({ name: 'owSecondsToMinutes' })
export class SecondsToMinutes implements PipeTransform {
  transform(seconds: number) {
    return Math.ceil(divide(seconds, MINUTE));
  }
}
