import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../../services';
import { CurrentUser, AppState } from '../../../models';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

@Component({
  selector: 'ow-account-overview',
  templateUrl: 'account-overview.component.html',
  styleUrls: ['account-overview.component.scss']
})

export class AccountOverviewComponent implements OnInit {

  currentUser: CurrentUser;

  constructor(private store: Store<AppState>, private authService: AuthorizationService) {
    this.currentUser = this.store.select('currentSession')
      .map(session => session.user);
  }

  ngOnInit() {
    this.currentUser.subscribe((user: CurrentUser) => this.currentUser = user);
  }

  signOut() {
    this.authService.logout();
  }

  preventClose($event) {
    $event.stopPropagation();
  }

}
