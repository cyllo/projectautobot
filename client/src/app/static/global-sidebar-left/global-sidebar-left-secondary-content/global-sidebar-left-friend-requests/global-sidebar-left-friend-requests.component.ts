import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../../models';
import { Store, Dispatcher } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FriendShipService } from '../../../../services';
import { rejectFriendRequest, updateFriendship } from '../../../../reducers'
import { filter, propEq, values } from 'ramda';

@Component({
  selector: 'ow-global-sidebar-left-friend-requests',
  templateUrl: 'global-sidebar-left-friend-requests.component.html',
  styleUrls: [ 'global-sidebar-left-friend-requests.component.scss' ],
  providers: [FriendShipService]
})

export class GlobalSideBarLeftFriendRequestsComponent implements OnInit {

  friendRequests: Observable<any>;

  constructor(private store: Store<AppState>, 
    private friendship: FriendShipService,
    private dispatcher: Dispatcher) {}

  ngOnInit() {
    this.friendRequests = this.store.select('friendships')
    .map(friendships => filter(propEq('isAccepted', false), values(friendships)));
  }

  accept(friendUserId, friendshipId) {
    this.friendship.accept(friendUserId, friendshipId)
    .subscribe(friendShip => this.dispatcher.dispatch(updateFriendship(friendShip)));
  }

  reject(friendUserId, friendshipId) {
    this.friendship.reject(friendUserId, friendshipId)
    .subscribe(rejected => {
      if(rejected) this.dispatcher.dispatch(rejectFriendRequest(friendshipId));
    });
  }
}
