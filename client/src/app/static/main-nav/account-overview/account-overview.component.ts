import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../../services';
import { User, AppState } from '../../../models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { isNil } from 'ramda';

@Component({
  selector: 'ow-account-overview',
  templateUrl: 'account-overview.component.html',
  styleUrls: ['account-overview.component.scss']
})

export class AccountOverviewComponent implements OnInit {
  currentUser$: Observable<User>;
  userProfiles: any;

  constructor(private store: Store<AppState>, private authService: AuthorizationService) {}

  ngOnInit() {
    this.currentUser$ = this.store.select('currentSession')
    .filter(session => !isNil(session))
    .map(({ user }) => user);

    this.currentUser$.subscribe(e => console.log('user:', e));
  }

  signOut() {
    this.authService.logout();
  }

  preventClose($event) {
    $event.stopPropagation();
  }

}
