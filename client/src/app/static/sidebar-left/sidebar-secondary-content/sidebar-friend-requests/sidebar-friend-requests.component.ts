import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-sidebar-friend-requests',
  templateUrl: 'sidebar-friend-requests.component.html',
  styleUrls: [ 'sidebar-friend-requests.component.scss' ]
})

export class SidebarFriendRequestsComponent implements OnInit {

  friendRequests: string[] = [];

  constructor() {}

  ngOnInit() {
    // TO POPULATE WITH DUMMY DATA
    for (let i = 0; i < 20; ++i) {
      const reqStr = Math.random().toString(36).slice(2);
      this.friendRequests.push(reqStr);
    }
  }

  removeFriendRequest(stubData: string): void {
    this.friendRequests.splice(this.friendRequests.findIndex(e => {
      return e === stubData;
    }), 1);
  }

}
