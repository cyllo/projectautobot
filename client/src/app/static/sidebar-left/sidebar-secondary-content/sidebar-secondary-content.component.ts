import { Component } from '@angular/core';


@Component({
  selector: 'ow-sidebar-secondary-content',
  templateUrl: 'sidebar-secondary-content.component.html',
  styleUrls: ['sidebar-secondary-content.component.scss']
})

export class SidebarSecondaryContentComponent {

  friendsCount = 5;
  friendRequestsCount = 1;

  constructor() {}

}
