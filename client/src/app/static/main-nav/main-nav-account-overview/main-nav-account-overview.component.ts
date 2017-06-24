import { Component } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ow-main-nav-account-overview',
  templateUrl: 'main-nav-account-overview.component.html',
  styleUrls: ['main-nav-account-overview.component.scss'],
  providers: [NgbDropdownConfig]
})

export class MainNavAccountOverviewComponent {

  constructor(config: NgbDropdownConfig) {
    config.autoClose = false;
  }

}
