import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { FollowGamerTag, UnfollowUser, UnfollowGamerTag } from './queries';
import { GraphqlResponse, AppState } from '../models';
import { unfollowUser, unfollowGamerTag } from '../reducers';
import { Store } from '@ngrx/store';


@Injectable()
export class FollowService {
  constructor(private apollo: Apollo, private store: Store<AppState>) {}

  followGamerTag(gamerTagId) {
    return this.apollo.mutate({
      mutation: FollowGamerTag,
      variables: { gamerTagId }
    });
  }

  unfollowUser(userId) {
    return this.apollo.mutate({
      mutation: UnfollowUser,
      variables: { userId }
    })
    .map(({ data: { unfollowUser: { unfollowed } } }: GraphqlResponse) => unfollowed)
    .subscribe(unfollowed => {
      if (unfollowed) {
        this.store.dispatch(unfollowUser(userId));
      }
    });
  }

  unfollowGamerTag(gamerTagId) {
    return this.apollo.mutate({
      mutation: UnfollowGamerTag,
      variables: { gamerTagId }
    })
    .map(({ data: { unfollowGamerTag: { unfollowed } } }: GraphqlResponse) => unfollowed)
    .subscribe(unfollowed => {
      if (unfollowed) {
        this.store.dispatch(unfollowGamerTag(gamerTagId));
      }
    });
  }
}
