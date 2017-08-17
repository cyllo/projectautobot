import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Credentials, AppState, GraphqlResponse, User, GamerTag } from '../models';
import { LoginUserMutation, logoutMutation, getCurrentUserQuery } from './queries';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { dissoc, prop } from 'ramda';
import { listFollowedUsers, listFollowedGamerTags, login } from '../reducers';
import * as Cookies from 'js-cookie';

const getUserProps = user => dissoc('following', user);
const getFollowedUsers = user => <User[]>prop('following', user);
const getFollowedGamerTags = user => <GamerTag[]>prop('followedGamerTags', user);

@Injectable()
export class AuthorizationService {

  constructor(private apollo: Apollo,
    private store: Store<AppState>,
    private router: Router) {}

  login({ password, email }: Credentials ) {
    return this.apollo.mutate({
      mutation: LoginUserMutation,
      variables: { email, password }
    })
    .map(({ data: { loginUser: { sessionInfo, user } } }: any) =>
    ({
      sessionInfo,
      user: getUserProps(user),
      followedUsers: getFollowedUsers(user),
      followedGamerTags: getFollowedGamerTags(user)
    }))
    .do(loginData => this.setAppState(loginData));
  }

  logout() {
    return this.apollo.mutate({
      mutation: logoutMutation
    })
    .subscribe(({data: { logoutUser: loggedOut } }: GraphqlResponse ) => {
      if (loggedOut) {
        this.store.dispatch({ type: 'LOG_OUT' });
        Cookies.remove('ow-auth-token');
        this.router.navigate(['./news']);
        this.apollo.getClient().resetStore();
      }
    });
  }

  refreshAppState({ sessionInfo }) {
    return this.apollo.query({
      query: getCurrentUserQuery
    }).map(({ data: { me: currentUser } }: GraphqlResponse) => currentUser)
    .subscribe(currentUser => {
      this.setAppState({
        sessionInfo,
        user: getUserProps(currentUser),
        followedUsers: getFollowedUsers(currentUser),
        followedGamerTags: getFollowedGamerTags(currentUser)
      });
    });
  }

  setAppState({ sessionInfo, user, followedUsers, followedGamerTags }) {

    if (sessionInfo) {
      Cookies.set('ow-auth-token', sessionInfo.token, { expires: new Date(sessionInfo.exp) });
    }

    this.store.dispatch(login({ user }));
    this.store.dispatch(listFollowedUsers(followedUsers));
    this.store.dispatch(listFollowedGamerTags(followedGamerTags));
  }
}
