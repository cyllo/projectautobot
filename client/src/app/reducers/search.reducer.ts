import { Search } from '../models';
import { GamerTag } from '../models';
import { assoc, compose } from 'ramda';

const initialState: Search = {
  profile: null,
  searching: false
};

const updateSearch = compose(assoc('searching', true), assoc('profile'));

export function searchPlayerTag(state: Search = initialState, { type, payload }): Search {
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
