import { Pipe, PipeTransform } from '@angular/core';
import { values } from 'ramda';
import { Friendship } from '../models';

@Pipe({ name: 'owValuesPipe' })
export class ValuesPipe implements PipeTransform {
    transform(object: Object): Array<Friendship> {
        return values(object);
    }
}
