import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'owParsePercent' })
export class ParsePercent implements PipeTransform {
  transform(winRate: string) {
    return parseFloat(winRate).toFixed(2);
  }
}
