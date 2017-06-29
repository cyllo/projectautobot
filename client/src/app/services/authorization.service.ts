import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Credentials, AppState } from '../models';
import { LoginUserMutation } from './queries';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { pathEq } from 'ramda';

@Injectable()
export class AuthorizationService {

  constructor(private apollo: Apollo,
    private store: Store<AppState>,
    private router: Router) {}

  login({ password, username: identifier }: Credentials ) {
    return this.apollo.mutate({
      mutation: LoginUserMutation,
      variables: { identifier, password }
    })
    .map(({ data: { loginUser: { sessionInfo, user } } }: any) => ({
      sessionInfo,
      user
    }))
    .do(session => this.setCurrentSession(session))
  }

  logout() {
    this.store.dispatch({ type: 'LOG_OUT' });
    window.localStorage.removeItem('session');
    this.router.navigate(['./news']);
  }

  setCurrentSession(session) {
    if(!pathEq(['sessionInfo', 'token'], null, session)) {
      this.store.dispatch({ type: 'AUTH', payload: session });
      window.localStorage.setItem('session', JSON.stringify(session));
    }
  }
}
