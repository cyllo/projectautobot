import { Search } from '../models';
import { Observable } from 'rxjs/Observable';

const initialState: Search = {
  tag: null
};

export function searchPlayerTag(state: Search = initialState, { type, payload }: { type: string, payload?: any }) {
  switch (type) {
    case 'GET_PLAYER_TAG':
      return payload;

    default:
      return state;
  }
}

export function searchGamerTag(state$: Observable<Search>) {
  return state$.select(state => state.search);
}
