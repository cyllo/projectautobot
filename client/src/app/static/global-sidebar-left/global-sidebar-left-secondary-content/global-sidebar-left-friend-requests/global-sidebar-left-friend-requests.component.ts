import { Component, OnInit } from '@angular/core';
import { AppState, FriendShip } from '../../../../models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FriendShipService } from '../../../../services'


@Component({
  selector: 'ow-global-sidebar-left-friend-requests',
  templateUrl: 'global-sidebar-left-friend-requests.component.html',
  styleUrls: [ 'global-sidebar-left-friend-requests.component.scss' ],
  providers: [FriendShipService]
})

export class GlobalSideBarLeftFriendRequestsComponent implements OnInit {

  friendRequests: Observable<FriendShip>;

  constructor(private store: Store<AppState>, private friendship: FriendShipService) {}

  ngOnInit() {
    this.friendRequests = this.store.select('friendships');
  }

  accept(friendUserId, friendshipId) {
    this.friendship.accept(friendUserId, friendshipId)
    .subscribe(val => console.log('we accepted!', val));
  }

  reject(friendUserId, friendshipId) {
    this.friendship.reject(friendUserId, friendshipId)
    .subscribe(val => console.log('we rejected!', val));
  }
}
