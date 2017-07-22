import { Component } from '@angular/core';

@Component({
  selector: 'ow-global-sidebar-left-friend-requests',
  templateUrl: 'global-sidebar-left-friend-requests.component.html',
  styleUrls: [ 'global-sidebar-left-friend-requests.component.scss' ]
})

export class GlobalSideBarLeftFriendRequestsComponent {

  items: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];

  constructor() {}

}
