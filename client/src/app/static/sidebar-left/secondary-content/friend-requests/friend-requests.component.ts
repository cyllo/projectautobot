import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-friend-requests',
  templateUrl: 'friend-requests.component.html',
  styleUrls: [ 'friend-requests.component.scss' ]
})

export class FriendRequestsComponent implements OnInit {

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
