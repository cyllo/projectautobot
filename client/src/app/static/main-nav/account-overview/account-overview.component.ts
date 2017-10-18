import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../../services';
import { User } from '../../../models';
import { ReducerStack } from '../../../reducers';
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

  constructor(private store: Store<ReducerStack>, private authService: AuthorizationService) {}

  ngOnInit() {
    this.currentUser$ = this.store.select('currentSession')
    .filter(session => !isNil(session))
    .map(({ user }) => user);
  }

  signOut() {
    this.authService.logout();
  }

  preventClose($event) {
    $event.stopPropagation();
  }

}
