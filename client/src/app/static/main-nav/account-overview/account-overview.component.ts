import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../../services';
import { CurrentUser, AppState } from '../../../models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ow-account-overview',
  templateUrl: 'account-overview.component.html',
  styleUrls: ['account-overview.component.scss']
})

export class AccountOverviewComponent implements OnInit {

  /*
   * fixes ts-lint warning:
   * The property "async" that you're trying to access does not
   * exist in the class declaration.
   *
   * https://github.com/angular/angular-cli/issues/4351
   */
  public async: any;

  currentUser$: Observable<CurrentUser>;
  userProfiles: any;

  constructor(private store: Store<AppState>, private authService: AuthorizationService) {}

  ngOnInit() {
    this.currentUser$ = this.store.select('currentSession').map(({ user }) => user);
  }

  signOut() {
    this.authService.logout();
  }

  preventClose($event) {
    $event.stopPropagation();
  }

}
