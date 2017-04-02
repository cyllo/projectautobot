import { Observable } from 'rxjs/Observable';
import { compose } from '@ngrx/core/compose';
import { AppState } from '../models';
import * as fromPlayerDataCollection from './playerDataCollection.reducer';
import * as fromPlayerData from './player-data.reducer';

export * from './player-data.reducer';
export * from './playerDataCollection.reducer';

export function getPlayerDataCollectionState(state$: Observable<AppState>) {
  return state$.select(state => state.playerDataCollection);
}

export const getPlayerDataCollectionLoaded = compose(fromPlayerDataCollection.getLoaded, getPlayerDataCollectionState);
export const getPlayerDataCollectionLoading = compose(fromPlayerDataCollection.getLoading, getPlayerDataCollectionState);
export const getPlayerDataCollectionGamerTags = compose(fromPlayerDataCollection.getGamerTags, getPlayerDataCollectionState);

export function getPlayerData(state$: Observable<AppState>) {
  return state$.select(state => state.playerData);
}

export const getPlayerGamerTag = compose(fromPlayerData.getGamerTag, getPlayerData);
