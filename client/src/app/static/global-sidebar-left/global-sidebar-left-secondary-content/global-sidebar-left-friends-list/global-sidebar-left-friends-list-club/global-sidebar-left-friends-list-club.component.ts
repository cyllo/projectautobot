import { Component, Input } from '@angular/core';
import { UserFriendsListClub } from '../../../../../models';


@Component({
  selector: 'ow-global-sidebar-left-friends-list-club',
  templateUrl: 'global-sidebar-left-friends-list-club.component.html',
  styleUrls: [ 'global-sidebar-left-friends-list-club.component.scss' ]
})

export class GlobalSideBarLeftFriendsListClubComponent {
  @Input() club: UserFriendsListClub;

  isCollapsed: boolean;
  clubEditPending: boolean;

  items: number[] = [0, 1, 2];

  constructor() {
    this.clubEditPending = false;
    this.isCollapsed = false;
  }

  clubEditStart(): void {
    this.clubEditPending = true;
  }

  clubEditEnd(): void {
    this.clubEditPending = false;
  }

}
