import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { isNil } from 'ramda';

import { AppState, CurrentSession, User } from '../models';
import { AuthorizationService } from '../services';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private authService: AuthorizationService
  ) { }

  canActivate() {
    return this.store
      .select('currentSession')
      .mergeMap((session: CurrentSession) => this.getSession(session))
      .map((user: User) => this.isAuthenticated(user));
  }

  private isAuthenticated(currentUser: User) {
    if (isNil(currentUser) || !currentUser.isAdmin) {
      this.router.navigate(['/']);

      return false;
    } else {

      return true;
    }
  }

  private getSession(session: CurrentSession) {
    if (session) {
      return Observable.of(session.user);
    } else {
      return this.authService.currentUser()
        .catch(() => Observable.of(null));
    }
  }
}
