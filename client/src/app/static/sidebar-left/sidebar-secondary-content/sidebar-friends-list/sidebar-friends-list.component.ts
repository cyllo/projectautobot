import { Component } from '@angular/core';
import { UserFriendsListClub } from '../../../../models';

@Component({
  selector: 'ow-sidebar-friends-list',
  templateUrl: 'sidebar-friends-list.component.html',
  styleUrls: [ 'sidebar-friends-list.component.scss' ]
})

export class SidebarFriendsListComponent {

  openSearchResults: boolean;
  clubCreationPending: boolean;
  responseMessage: string;

  clubs: UserFriendsListClub[] = [
    {
      name: 'Crew',
      mutable: true
    },
    {
      name: 'General',
      mutable: false
    }
  ];

  constructor() {
    this.clubCreationPending = false;
    this.openSearchResults = false;
  }

  clubCreationStart(): void {
    this.clubCreationPending = true;
  }

  clubCreationEnd(): void {
    this.clubCreationPending = false;
  }

}
