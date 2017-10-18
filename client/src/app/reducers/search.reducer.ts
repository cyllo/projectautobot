import { GamerTag } from '../models';
import { assoc, compose } from 'ramda';

export interface SearchState {
  profile?: GamerTag[];
  searching?: boolean;
}

const initialState: SearchState = {
  profile: null,
  searching: false
};

const updateSearch = compose(assoc('searching', true), assoc('profile'));

export function searchPlayerTag(state: SearchState = initialState, { type, payload }): SearchState {
  switch (type) {
    case 'START_SEARCH':
      return assoc('searching', true, state);

    case 'SEARCH_RESULTS':
      return updateSearch(payload, state);

    case 'RESET_SEARCH':
      return initialState;
    default:
      return state;
  }
}


export function startTagSearch() {
  return { type: 'START_SEARCH' };
}

export function searchResults(profile: GamerTag[]) {
  return { type: 'SEARCH_RESULTS', payload: profile };
}

export function resetTagSearch() {
  return { type: 'RESET_SEARCH' };
}
