import { Component } from '@angular/core';


@Component({
  selector: 'ow-global-sidebar-left',
  templateUrl: 'global-sidebar-left.component.html',
  styleUrls: [ 'global-sidebar-left.component.scss' ]
})

export class GlobalSideBarLeftComponent {

  sideNavOpen: boolean;

  constructor() {
    this.sideNavOpen = false;
  }

  onSideNavOpenStart(): void {
    this.sideNavOpen = true;
  }

  onSideNavCloseStart(): void {
    this.sideNavOpen = false;
  }

}
