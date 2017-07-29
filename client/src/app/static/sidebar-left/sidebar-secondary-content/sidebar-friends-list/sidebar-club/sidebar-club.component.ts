import { Component, Input } from '@angular/core';
import { UserFriendsListClub } from '../../../../../models';

@Component({
  selector: 'ow-sidebar-club',
  templateUrl: 'sidebar-club.component.html',
  styleUrls: [ 'sidebar-club.component.scss' ]
})

export class SidebarClubComponent {
  @Input() club: UserFriendsListClub;

  clubNameEditInProgress: boolean;
  expansionPanelCollapsed: boolean;


  items: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor() {
    this.clubNameEditInProgress = false;
    this.expansionPanelCollapsed = false;
  }

  compareProfiles(event) {
    event.stopPropagation();
  }

  clubNameEditStart(event) {
    this.clubNameEditInProgress = true;
    event.stopPropagation();
  }

  clubNameEditEnd(event) {
    this.clubNameEditInProgress = false;
    event.stopPropagation();
  }

  expandedEvent() {
    this.expansionPanelCollapsed = false;
  }

  collapsedEvent() {
    this.expansionPanelCollapsed = true;
  }

}
