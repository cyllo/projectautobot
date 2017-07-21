import { Component, Input } from '@angular/core';
import { UserFriendsListClub } from '../../../../../models';

@Component({
  selector: 'ow-club',
  templateUrl: 'club.component.html',
  styleUrls: [ 'club.component.scss' ]
})

export class ClubComponent {
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
