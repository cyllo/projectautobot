import { RouterState } from '@ngrx/router-store';
import { Player } from './player.model';
import { Search } from './search.model';
import * as fromCollection from '../reducers/playerDataCollection.reducer';

export interface AppState {
  players?: Player[];
  playerData?: Player;
  playerDataCollection?: fromCollection.State;
  router?: RouterState;
  search?: Search;
}
