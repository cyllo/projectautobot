import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../models'


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store<AppState>) {}

  canActivate() {
    return this.store.select('currentSession')
    .map(({ sessionInfo }) => {
      if(sessionInfo) return true;
      this.router.navigate(['./news']);
      return false;
    });
  }
}
