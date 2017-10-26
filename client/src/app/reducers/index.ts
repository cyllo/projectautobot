import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { propEq } from 'ramda';
import { Hero, CurrentHero } from '../models';

export * from './profiles.reducer';
export * from './search.reducer';
export * from './heroes.reducer';
export * from './current-hero.reducer';
export * from './blog-post.reducer';
export * from './friendship.reducer';
export * from './clubs.reducer';
export * from './following-user.reducer';
export * from './following-gamertag.reducer';
export * from './side-bar-search-results';
export * from './snapshots';
export * from './statistical-trends';

import { profiles, GamerTagState } from './profiles.reducer';
import { searchPlayerTag, SearchState } from './search.reducer';
import { heroesData } from './heroes.reducer';
import { currentHeroData } from './current-hero.reducer';
import { blogPosts, BlogPostState } from './blog-post.reducer';
import { friendships, FriendshipState } from './friendship.reducer';
import { clubs, ClubState } from './clubs.reducer';
import { followedUsers, FollowingUserState } from './following-user.reducer';
import { followedGamerTags, FollowingGamerTagState } from './following-gamertag.reducer';
import { sideBarSearchResults, SideBarSearchResults } from './side-bar-search-results';
import { initialState as sideBarState } from './side-bar-search-results';
import { snapshots, SnapshotState } from './snapshots';
import { statTrends, TrendsState } from './statistical-trends';

const clearable = (reducer, defaultValue) => (state, action) => {
  if (propEq('type', 'LOG_OUT', action)) {
      return defaultValue;
  }
  return reducer(state, action);
};

export interface ReducerStack {
  profiles: GamerTagState;
  search: SearchState;
  heroes: Hero[];
  currentHero: CurrentHero;
  blogPosts: BlogPostState;
  friendships: FriendshipState;
  clubs: ClubState;
  followedUsers: FollowingUserState;
  followedGamerTags: FollowingGamerTagState;
  router: any;
  sideBarSearchResults: SideBarSearchResults;
  snapshots: SnapshotState;
  statTrends: TrendsState[];
}

export const reducerStack: ActionReducerMap<ReducerStack> = {
  profiles,
  search: searchPlayerTag,
  heroes: heroesData,
  currentHero: currentHeroData,
  blogPosts,
  friendships: clearable(friendships, {}),
  clubs: clearable(clubs, {}),
  followedUsers: clearable(followedUsers, {}),
  followedGamerTags: clearable(followedGamerTags, {}),
  router: routerReducer,
  sideBarSearchResults: clearable(sideBarSearchResults, sideBarState),
  snapshots,
  statTrends
};


