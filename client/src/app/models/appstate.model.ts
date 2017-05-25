import { RouterState } from '@ngrx/router-store';
import { Player, SnapshotStats, Search } from './index';
import * as fromCollection from '../reducers';

export interface AppState {
  players?: Player[];
  playerData?: Player;
  playerDataCollection?: fromCollection.State;
  router?: RouterState;
  search?: Search;
  snapshotStats?: SnapshotStats;
}
