import { Search } from '../models';
import { GamerTag } from '../models';
import { assoc } from 'ramda';

const initialState: Search = {
  profile: null,
  searching: false
};

export function searchPlayerTag(state: Search = initialState, { type, payload }): Search {
  switch (type) {
    case 'START_SEARCH':
      return assoc('searching', true, state);

    case 'SEARCH_RESULTS':
      let derp = assoc('searching', true, state);
      return assoc('profile', payload, derp);

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
