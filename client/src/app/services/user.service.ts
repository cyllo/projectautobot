import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { User, GraphqlResponse } from '../models';
import { getFriendRequests } from '../reducers';
import { Dispatcher } from '@ngrx/store';
import {
  CreateUserMutation,
  ConnectUserToBattleNetMutation,
  userSearchQuery,
  friendShipsQuery } from './queries';

interface UserParams extends User {
  clientAuthToken: string;
}

interface SearchResponse {
  data: any;
}

@Injectable()
export class UserService {
  constructor(private apollo: Apollo, private dispatcher: Dispatcher) {}

  create({ password, email, displayName, clientAuthToken }: UserParams) {
    return this.apollo.mutate({
      mutation: CreateUserMutation,
      variables: { password, displayName, email, clientAuthToken }
    });
  }

  find(displayName) {
    return this.apollo.query({
      query: userSearchQuery,
      variables: { displayName }
    }).map(({ data: { users } }: SearchResponse) => users);
  }

  connectToBattleNet(clientAuthToken) {
    return this.apollo.mutate({
      mutation: ConnectUserToBattleNetMutation,
      variables: { clientAuthToken }
    });
  }

  listFriendRequests() {
    return this.apollo.query({
      query: friendShipsQuery,
      variables: { isIncoming: true}
    })
    .map(({ data: { me: { friendships: friendRequests } } }: GraphqlResponse) => friendRequests)
    .subscribe(friendRequests => this.dispatcher.dispatch(getFriendRequests(friendRequests)));

  }
}
