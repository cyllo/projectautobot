import { compose, not, isEmpty, isNil } from 'ramda';

export function notEmpty(item: Array<any> | Object): boolean {
  return compose(not, isEmpty)(item);
}

export function notNil(item: Array<any> | Object): boolean {
  return compose(not, isNil)(item);
}