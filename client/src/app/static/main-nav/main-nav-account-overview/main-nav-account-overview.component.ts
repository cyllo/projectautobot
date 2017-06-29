import { Component } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthorizationService } from '../../../services';

@Component({
  selector: 'ow-main-nav-account-overview',
  templateUrl: 'main-nav-account-overview.component.html',
  styleUrls: ['main-nav-account-overview.component.scss'],
  providers: [NgbDropdownConfig]
})

export class MainNavAccountOverviewComponent {

  constructor(config: NgbDropdownConfig,
    private authService: AuthorizationService) {
    config.autoClose = false;
  }

  signOut() {
    this.authService.logout();
  }
}
