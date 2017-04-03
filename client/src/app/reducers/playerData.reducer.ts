import { Observable } from 'rxjs/Observable';
import { Player } from '../models';

const initialState: Player = {
  totalGamesWon: null,
  quickPlay: null,
  portraitUrl: null,
  overwatchName: null,
  levelUrl: null,
  level: null,
  gamerTag: null,
  competitiveRankUrl: null,
  competitiveLevel: null,
  competitive: null
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
  return state$.select(state => state.gamerTag);
}
