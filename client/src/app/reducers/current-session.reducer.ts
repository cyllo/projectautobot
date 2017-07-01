import { CurrentSession } from '../models';

const initialState: CurrentSession = {
  id: null,
  email: null,
  username: null
};

export function currentSession(state: CurrentSession = initialState, { type, payload }: { type: string, payload?: any }) {
  switch (type) {
    case 'AUTH':
      return payload;
    case 'LOG_OUT':
      return payload = initialState;
    default:
      return state;
  }
}
