import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { propEq, filter, values } from 'ramda';
import { Dispatcher, Store } from '@ngrx/store';

import { ClubService } from '../services';
import { RequestFriendship, AcceptFriendship, RejectFriendship, RemoveFriend } from './queries';
import { rejectFriendRequest, updateFriendship, deleteFriendship } from '../reducers';
import { AppState, GraphqlResponse } from '../models';



@Injectable()
export class FriendShipService {
  constructor(private apollo: Apollo,
    private dispatcher: Dispatcher,
    private store: Store<AppState>,
    private club: ClubService
  ) {}


  request(id) {
    return this.apollo.mutate({
      mutation: RequestFriendship,
      variables: { id }
    })
    .map(({ data: { sendFriendRequest: friendship } }: GraphqlResponse) => friendship);
  }

  accept(friendUserId, friendshipId) {
    return this.apollo.mutate({
      mutation: AcceptFriendship,
      variables: { friendUserId, friendshipId }
    })
    .map(({ data: { acceptFriendRequest }}: GraphqlResponse) => acceptFriendRequest)
    .withLatestFrom(this.store.select('clubs'), (friendship, clubs) => {
      const isGeneralClub = propEq('name', 'General');
      const [generalClub] = filter(isGeneralClub, values(clubs)); // weird issue where ramda filter w/ tslint doesn't work on objects
      return { friendship, generalClub };
    })
    .do(({ friendship, generalClub: { id: clubId } } ) => this.club.addFriendship(friendship, clubId))
    .subscribe(({ friendship }) => this.dispatcher.dispatch(updateFriendship(friendship)));
  }

  reject(friendUserId, friendshipId) {
    return this.apollo.mutate({
      mutation: RejectFriendship,
      variables: { friendUserId, friendshipId }
    })
    .map(({ data: { rejectFriendRequest: { rejected } } }: GraphqlResponse) => rejected)
    .subscribe(rejected => {
      if (rejected) {
        this.dispatcher.dispatch(rejectFriendRequest(friendshipId));
      }
    });
  }

  delete(friendshipId) {
    return this.apollo.mutate({
      mutation: RemoveFriend,
      variables: { friendshipId }
    })
    .filter(({ data: { removeFriend: { removed } } }: GraphqlResponse) => removed)
    .subscribe(() => this.dispatcher.dispatch(deleteFriendship(friendshipId)));
  }
}
