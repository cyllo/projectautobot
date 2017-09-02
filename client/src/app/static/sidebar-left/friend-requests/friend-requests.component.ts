import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter, propEq, values, length } from 'ramda';

@Component({
  selector: 'ow-friend-requests',
  templateUrl: 'friend-requests.component.html',
  styleUrls: [ 'friend-requests.component.scss' ]
})

export class FriendRequestsComponent implements OnInit {

  friendRequests: Observable<any>;
  friendRequestCount: boolean;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.friendRequests = this.store.select('friendships')
    .map(friendships => filter(propEq('isAccepted', false), values(friendships)));

    this.friendRequests
    .subscribe(friendRequests => {
      this.friendRequestCount = length(friendRequests) > 0;
    });
  }

}
