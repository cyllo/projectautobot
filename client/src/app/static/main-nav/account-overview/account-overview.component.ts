import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../../services';
import { CurrentSession, CurrentUser, AppState } from '../../../models';
import { Store } from '@ngrx/store';

@Component({
  selector: 'ow-account-overview',
  templateUrl: 'account-overview.component.html',
  styleUrls: ['account-overview.component.scss']
})

export class AccountOverviewComponent implements OnInit {

  currentUser: CurrentUser;
  userProfiles: any;

  constructor(private store: Store<AppState>,
              private authService: AuthorizationService) {
  }

  ngOnInit() {
    this.store.select('currentSession')
      .map((session: CurrentSession) => session.user)
      .subscribe((user: CurrentUser) => this.currentUser = user);
  }

  signOut() {
    this.authService.logout();
  }

  preventClose($event) {
    $event.stopPropagation();
  }

}
