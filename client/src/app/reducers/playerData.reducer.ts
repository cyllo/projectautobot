import { Observable } from 'rxjs/Observable';
import { Player } from '../models';

const initialState: Player = {
  updatedAt: null,
  totalGamesWon: null,
  tag: null,
  snapshotStatistics: null,
  region: null,
  portraitUrl: null,
  platform: null,
  overwatchName: null,
  levelUrl: null,
  level: null,
  insertedAt: null,
  id: null,
  competitiveRankUrl: null,
  competitiveLevel: null,
};

export function playerData(state: Player = initialState, { type, payload }: { type: string, payload?: any }) {
  switch (type) {
    case 'GET_PLAYER_DATA':
      return payload;

    default:
      return state;
  }
}

export function getGamerTag(state$: Observable<Player>) {
  return state$.select(state => state.tag);
}
