import { Search } from '../models';

const initialState: Search = {
  tag: null
};

export function playerTag(state: Search = initialState, { type, payload }: { type: string, payload?: any }) {
  switch (type) {
    case 'GET_PLAYER_TAG':
      return payload;

    default:
      return state;
  }
}
