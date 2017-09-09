import { Pipe, PipeTransform } from '@angular/core';
import { divide } from 'ramda';
const HOUR = 3600;

@Pipe({ name: 'owSecondsToHours' })
export class SecondsToHours implements PipeTransform {
  transform(seconds: number) {
    return Math.ceil(divide(seconds, HOUR));
  }
}
