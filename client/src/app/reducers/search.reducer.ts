import { Search } from '../models';
import { Observable } from 'rxjs/Observable';

const initialState: Search = {
  tag: null,
  searching: false
};

export function searchPlayerTag(state: Search = initialState, { type, payload }): Search {
  switch (type) {
    case 'GET_PLAYER_TAG':
      return payload;

    default:
      return state;
  }
}

export function searchGamerTag(state$: Observable<Search>) {
  return state$.select(search => search.tag);
}
