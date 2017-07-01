import { Heroes } from '../models';

export function heroesData(state: Array<Heroes> = [], { type, payload }: { type: string, payload?: any }) {
  switch (type) {
    case 'GET_HEROES_DATA':
      return payload;

    default:
      return state;
  }
}
