import { Observable } from 'rxjs/Observable';
import { compose } from '@ngrx/core/compose';
import { AppState } from '../models';
import * as fromPlayerDataCollection from './playerDataCollection.reducer';

export * from './playerDataCollection.reducer';
export * from './players.reducer';
export * from './search.reducer';
export * from './snapshot.reducer';
export * from './heroes.reducer';
export * from './current-hero.reducer';
export * from './blog-post.reducer';
export * from './current-session.reducer';
export * from './friendship.reducer';
export * from './clubs.reducer';

export function getPlayerDataCollectionState(state$: Observable<AppState>) {
  return state$.select(playerDataCollection => playerDataCollection);
}

export const getPlayerDataCollectionLoaded = compose(fromPlayerDataCollection.getLoaded, getPlayerDataCollectionState);
export const getPlayerDataCollectionLoading = compose(fromPlayerDataCollection.getLoading, getPlayerDataCollectionState);
export const getPlayerDataCollectionGamerTags = compose(fromPlayerDataCollection.getGamerTags, getPlayerDataCollectionState);
