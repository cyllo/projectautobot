import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Credentials, GraphqlResponse, User, GamerTag } from '../models';
import { Login, Logout, CurrentUser } from './queries';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { dissoc, prop, propEq } from 'ramda';
import { listFollowedUsers, listFollowedGamerTags, login, ReducerStack } from '../reducers';
import * as Cookies from 'js-cookie';
import { ErrorHandlerService } from './error-handler.service';
import { Observable } from 'rxjs/Observable';
import { ApolloError } from 'apollo-client';

const getUserProps = user => dissoc('following', user);
const getFollowedUsers = user => <User[]>prop('following', user);
const getFollowedGamerTags = user => <GamerTag[]>prop('followedGamerTags', user);

@Injectable()
export class AuthorizationService {

  constructor(private apollo: Apollo,
    private store: Store<ReducerStack>,
    private router: Router,
    private error: ErrorHandlerService
  ) {}

  login({ password, email }: Credentials ) {
    return this.apollo.mutate({
      mutation: Login,
      variables: { email, password }
    })
    .map(({ data: { loginUser: { sessionInfo, user } } }: GraphqlResponse) =>
    ({
      sessionInfo,
      user: getUserProps(user),
      followedUsers: getFollowedUsers(user),
      followedGamerTags: getFollowedGamerTags(user)
    }))
    .do(loginData => this.setAppState(loginData))
    .catch(error => {
      this.error.show(error);
      return Observable.of(undefined);
    });
  }

  logout() {
    return this.apollo.mutate({
      mutation: Logout
    })
    .subscribe(({data: { logoutUser: loggedOut } }: GraphqlResponse ) => {
      if (loggedOut) {
        this.store.dispatch({ type: 'LOG_OUT' });
        this.apollo.getClient().resetStore();
        Cookies.remove('ow-auth-token');
        this.router.navigate(['']);
      }
    });
  }

  currentUser(): Observable<User> {
    return this.apollo.query({query: CurrentUser})
      .map(({ data: { me: currentUser } }: GraphqlResponse) => currentUser);
  }

  refreshAppState({ sessionInfo }) {
    return this.currentUser()
      .catch((error: ApolloError) => Observable.throw(this.error.filterGraphqlMessage(error)))
      .subscribe(currentUser => {
        this.setAppState({
          sessionInfo,
          user: getUserProps(currentUser),
          followedUsers: getFollowedUsers(currentUser),
          followedGamerTags: getFollowedGamerTags(currentUser)
        });
      }, (error) => {
        if (propEq('message', 'user token is not active', error)) {
          Cookies.remove('ow-auth-token');
          this.router.navigate(['./login']);
        }
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
