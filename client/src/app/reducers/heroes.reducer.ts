import { Heroes } from '../models';
import { find, propEq } from 'ramda';

export function heroesData(state: Array<Heroes> = [], { type, payload }: { type: string, payload?: any }) {
  switch (type) {
    case 'GET_HEROES_DATA':
      return payload;

    default:
      return state;
  }
}


export function getHeroByName(name: string) {
  return state => state.map(find(propEq('name', name)));
}

export function getHeryById(id: number) {
  return state => state.map(find(propEq('id', id)));
}
