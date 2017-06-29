import { CurrentSession } from '../models';

const initialState: CurrentSession = {
  sessionInfo: {
    token: null,
    exp: null,
  },
  user: {
    username: null,
    id: null,
    email: null
  }
};

export function currentSession(state: CurrentSession = initialState, { type, payload }: { type: string, payload?: any }) {
  switch (type) {
    case 'AUTH':
      return payload;
    case 'LOG_OUT':
      return initialState;
    default:
      return state;
  }
}
