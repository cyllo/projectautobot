import { RouterState } from '@ngrx/router-store';
import { PlayerData } from './player-data.model';
import * as fromCollection from '../reducers/playerDataCollection.reducer';

export interface AppState {
  playerData?: PlayerData;
  playerDataCollection?: fromCollection.State;
  router?: RouterState;
}
