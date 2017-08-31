import { Pipe, PipeTransform } from '@angular/core';
import { isNil, compose, not, isEmpty, prop, filter, both } from 'ramda';
import { GamerTag } from '../models';

const notNil = compose(not, isNil, prop('snapshotStatistics'));
const notEmpty = compose(not, isEmpty, prop('snapshotStatistics'));

@Pipe({ name: 'owHasSnapshot' })
export class HasSnapshot implements PipeTransform {
  transform(gamerTags: GamerTag[]) {
    return filter(both(notNil, notEmpty), gamerTags);
  }
}
