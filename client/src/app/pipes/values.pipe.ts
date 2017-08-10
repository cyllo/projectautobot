import { Pipe, PipeTransform } from '@angular/core';
import { values } from 'ramda';
import { FriendShip } from '../models';

@Pipe({ name: 'owValuesPipe' })
export class ValuesPipe implements PipeTransform {
    transform(object: Object): Array<FriendShip> {
        return values(object);
    }
}
