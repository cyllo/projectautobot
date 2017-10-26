import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CurrentSession } from '../models';
import { ReducerStack } from '../reducers';
import { isNil } from 'ramda';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store<ReducerStack>) {}

  canActivate() {
    return this.store
      .select('currentSession')
      .map((session: CurrentSession) => this.isAuthenticated(session));
  }

  isAuthenticated(currentSession: CurrentSession) {
    if (isNil(currentSession)) {
      this.router.navigate(['/']);

      return false;
    } else {
      return true;
    }
  }
}
