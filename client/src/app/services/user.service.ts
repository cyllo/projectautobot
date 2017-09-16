import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { User, GraphqlResponse } from '../models';
import { getFriendRequests, getClubs } from '../reducers';
import { Dispatcher } from '@ngrx/store';
import { merge } from 'ramda';
import {
  CreateUser,
  ConnectToBattlenet,
  FindUser,
  Friendships,
  Clubs } from './queries';

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
      mutation: CreateUser,
      variables: { password, displayName, email, clientAuthToken }
    })
    .map(({ data: { createUser: user} }: GraphqlResponse) => merge(user, { password }));
  }

  find(displayName) {
    return this.apollo.query({
      query: FindUser,
      variables: { displayName }
    }).map(({ data: { users } }: SearchResponse) => users);
  }

  connectToBattleNet(clientAuthToken) {
    return this.apollo.mutate({
      mutation: ConnectToBattlenet,
      variables: { clientAuthToken }
    });
  }

  listFriendRequests() {
    return this.apollo.query({
      query: Friendships,
      variables: { isSender: false }
    })
    .map(({ data: { me: { friendships: friendRequests } } }: GraphqlResponse) => friendRequests)
    .subscribe(friendRequests => this.dispatcher.dispatch(getFriendRequests(friendRequests)));

  }

  listClubs() {
    return this.apollo.query({
      query: Clubs
    })
    .map(({ data: {me: { friendGroups: clubs } } }: GraphqlResponse ) => clubs)
    .subscribe(clubs => this.dispatcher.dispatch(getClubs(clubs)));
  }
}
