import { RouterState } from '@ngrx/router-store';
import { PlayerData } from './player-data.model';

export interface AppState {
  playerData?: PlayerData;
  router?: RouterState;
}
