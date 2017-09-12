import { routerReducer } from '@ngrx/router-store';
import { propEq } from 'ramda';

export * from './profiles.reducer';
export * from './search.reducer';
export * from './heroes.reducer';
export * from './current-hero.reducer';
export * from './blog-post.reducer';
export * from './current-session.reducer';
export * from './friendship.reducer';
export * from './clubs.reducer';
export * from './following-user.reducer';
export * from './following-gamertag.reducer';
export * from './side-bar-search-results';
export * from './snapshots';
export * from './watch-snapshot.reducer';

import { profiles } from './profiles.reducer';
import { searchPlayerTag } from './search.reducer';
import { heroesData } from './heroes.reducer';
import { currentHeroData } from './current-hero.reducer';
import { blogPosts } from './blog-post.reducer';
import { currentSession } from './current-session.reducer';
import { friendships } from './friendship.reducer';
import { clubs } from './clubs.reducer';
import { followedUsers } from './following-user.reducer';
import { followedGamerTags } from './following-gamertag.reducer';
import { sideBarSearchResults } from './side-bar-search-results';
import { initialState as sideBarState } from './side-bar-search-results';
import { snapshots } from './snapshots';
import { watchSnapshot } from './watch-snapshot.reducer';

const clearable = (reducer, defaultValue) => (state, action) => {
  if (propEq('type', 'LOG_OUT', action)) {
      return defaultValue;
  }
  return reducer(state, action);
};

export const reducerStack = {
  profiles,
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
  sideBarSearchResults: clearable(sideBarSearchResults, sideBarState),
  snapshots,
  watchSnapshot
};

export const initialStates = {
  blogPost: {},
  players: [],
  router: {},
  snapshotStats: {}
};
