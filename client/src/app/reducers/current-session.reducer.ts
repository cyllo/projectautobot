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

export function currentSession(state: CurrentSession, { type, payload }: { type: string, payload?: any }) {
  switch (type) {
    case 'LOGIN':
      return payload;
    case 'LOG_OUT':
      return initialState;
    default:
      return state;
  }
}

export function login(session) {
  return { type: 'LOGIN', payload: session };
}
