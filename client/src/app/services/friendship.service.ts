import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { propEq, filter, values, uniqBy, prop, map, reject, assoc, any, not, compose, isEmpty } from 'ramda';
import { Dispatcher, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ClubService, UserService } from '../services';
import { RequestFriendship, AcceptFriendship, RejectFriendship, RemoveFriend, PendingFriendships } from './queries';
import { rejectFriendRequest, updateFriendship, deleteFriendship, getGeneralClub } from '../reducers';
import { AppState, GraphqlResponse, Friendship, User } from '../models';

const notEmpty = compose(not, isEmpty);

@Injectable()
export class FriendShipService {
  constructor(private apollo: Apollo,
    private dispatcher: Dispatcher,
    private store: Store<AppState>,
    private club: ClubService,
    private userService: UserService
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

  pending() {
    return this.apollo.query({ query: PendingFriendships, fetchPolicy: 'network-only'})
    .map(({ data: { me: { incomingRequests, outgoingRequests } } }: GraphqlResponse) => {
      return uniqBy(prop('id'), [...incomingRequests, ...outgoingRequests]);
    });
  }

  search(displayName: string) {
    return Observable.combineLatest(
      this.pending(),
      this.userService.find(displayName),
      this.store.select('clubs').filter(notEmpty).let(getGeneralClub()).pluck('friendships').take(1),
      (pending: Friendship[], users: User[], existingFriends: Friendship[]) => {
        const checkPending = user => assoc('pending', any(propEq('friendId', user.id), pending), user);
        const checkExisting = user => any(propEq('friendId', user.id), existingFriends);
        return <User[]>map(checkPending, reject(checkExisting, users));
      }
    );
  }
}
