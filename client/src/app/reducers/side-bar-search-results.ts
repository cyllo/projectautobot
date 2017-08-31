
import { SideBarSearchResults, GenericPayload, User } from '../models';
import { assoc, compose, not, prop, lens, set } from 'ramda';

export const initialState = {
  users: [],
  display: false,
  searching: false
};

const completeSearch = compose(assoc('searching', false), assoc('display', true), assoc('users'));
const displayLens = lens(prop('display'), assoc('display'));

export function sideBarSearchResults(state: SideBarSearchResults = initialState, { type, payload }: GenericPayload) {
  switch (type) {
    case 'START_SEARCH':
      return assoc('searching', true, state);

    case 'SEARCH_COMPLETE':
      return completeSearch(payload, state);

    case 'RESET_SEARCH':
      return initialState;

    case 'TOGGLE_DISPLAY':
      return set(displayLens, not(prop('display', state)), state);

    case 'UPDATE_RESULTS':
      return assoc('users', payload, state);
    default:
      return state;
  }
}

export function startSideBarSearch() {
  return { type: 'START_SEARCH' };
}

export function completeSideBarSearch(users: User[]) {
  return { type: 'SEARCH_COMPLETE', payload: users };
}

export function resetSideBarSearch() {
  return { type: 'RESET_SEARCH' };
}

export function toggleDisplaySideBarSearch() {
  return { type: 'TOGGLE_DISPLAY' };
}

export function updateSideBarSearch(users: User[]) {
  return { type: 'UPDATE_RESULTS', payload: users };
}
