import { Component } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AppState } from '../../../models';

@Component({
  selector: 'ow-main-nav-account-overview',
  templateUrl: 'main-nav-account-overview.component.html',
  styleUrls: ['main-nav-account-overview.component.scss'],
  providers: [NgbDropdownConfig]
})

export class MainNavAccountOverviewComponent {

  constructor(config: NgbDropdownConfig, private store: Store<AppState>) {
    config.autoClose = false;
  }

  signOut() {
    this.store.dispatch({ type: 'LOG_OUT' });
  }
}
