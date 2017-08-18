import { routerReducer } from '@ngrx/router-store';
import { propEq } from 'ramda';

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
export * from './following-user.reducer';
export * from './following-gamertag.reducer';

import { playerDataCollection } from './playerDataCollection.reducer';
import { players } from './players.reducer';
import { searchPlayerTag } from './search.reducer';
import { snapshotData } from './snapshot.reducer';
import { heroesData } from './heroes.reducer';
import { currentHeroData } from './current-hero.reducer';
import { blogPosts } from './blog-post.reducer';
import { currentSession } from './current-session.reducer';
import { friendships } from './friendship.reducer';
import { clubs } from './clubs.reducer';
import { followedUsers } from './following-user.reducer';
import { followedGamerTags } from './following-gamertag.reducer';


const clearable = (reducer, defaultValue) => (state, action) => {
  if (propEq('type', 'LOG_OUT', action)) {
      return defaultValue;
  }
  return reducer(state, action);
};

export const reducerStack = {
  players,
  playerDataCollection,
  search: searchPlayerTag,
  heroes: heroesData,
  currentHero: currentHeroData,
  blogPosts,
  currentSession: clearable(currentSession, undefined),
  friendships: clearable(friendships, {}),
  clubs: clearable(clubs, {}),
  followedUsers: clearable(followedUsers, {}),
  followedGamerTags: clearable(followedGamerTags, {}),
  router: routerReducer,
  snapshotStats: snapshotData,
};

export const initialStates = {
  blogPost: {},
  players: [],
  router: {},
  snapshotStats: {}
};
