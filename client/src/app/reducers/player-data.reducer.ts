import { Observable } from 'rxjs/Observable';
import { PlayerData } from '../models';

const initialState: PlayerData = {
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

export function playerData(state: PlayerData = initialState, { type, payload }: { type: string, payload?: any }) {
  switch (type) {
    case 'GET_PLAYER_DATA':
      return payload;

    default:
      return state;
  }
}

export function getGamerTag(state$: Observable<PlayerData>) {
  return state$.select(state => state.gamerTag);
}
