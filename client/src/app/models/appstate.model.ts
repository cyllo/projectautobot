import { RouterState } from '@ngrx/router-store';
import { Player, SnapshotStats, Search, Heroes, CurrentHero } from './index';

export interface AppState {
  players?: Player[];
  playerData?: Player;
  router?: RouterState;
  search?: Search;
  snapshotStats?: SnapshotStats;
  heroes?: Heroes;
  currentHero?: CurrentHero;
}
