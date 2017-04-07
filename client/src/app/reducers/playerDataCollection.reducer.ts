import { Observable } from 'rxjs/Observable';
import '@ngrx/core/add/operator/select';

export interface State {
  loaded: boolean;
  loading: boolean;
  gamerTags: Array<string>;
}

const initialState: State = {
  loaded: false,
  loading: false,
  gamerTags: []
};

export function playerDataCollection(state = initialState, { type, payload }): State {
  switch (type) {
    case 'LOAD':
      return Object.assign({}, state, { loaded: false, loading: true });

    case 'LOAD_SUCCESS':
      const players = payload;

      return {
        loaded: true,
        loading: false,
        gamerTags: players.map(player => player.tag)
      };

    default:
      return state;
  }
}

export function getLoaded(state$: Observable<State>) {
  return state$.select(s => s.loaded);
}

export function getLoading(state$: Observable<State>) {
  return state$.select(s => s.loading);
}

export function getGamerTags(state$: Observable<State>) {
  return state$.select(s => s.gamerTags);
}
