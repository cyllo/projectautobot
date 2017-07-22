import { Component } from '@angular/core';
import { UserFriendsListClub } from '../../../../models';

@Component({
  selector: 'ow-global-sidebar-left-friends-list',
  templateUrl: 'global-sidebar-left-friends-list.component.html',
  styleUrls: [ 'global-sidebar-left-friends-list.component.scss' ]
})

export class GlobalSideBarLeftFriendsListComponent {

  openSearchResults: boolean;
  clubCreationPending: boolean;
  responseMessage: string;

  clubs: UserFriendsListClub[] = [
    {
      name: 'High Elo Team mates',
      mutable: true
    },
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

  clubCreationStarted(): void {
    this.clubCreationPending = true;
  }

  clubCreationEnded(): void {
    this.clubCreationPending = false;
    this.openSearchResults = !this.openSearchResults;
    this.setResponseMessage();
  }

  private setResponseMessage(): void {
    this.responseMessage = 'Color coated response message.';
    setTimeout(() => { this.responseMessage = null; }, 1500);
  }

}
