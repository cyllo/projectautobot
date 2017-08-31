import { Component, Input } from '@angular/core';
import { FriendShipService } from '../../../../services';


@Component({
  selector: 'ow-friend-request-card',
  templateUrl: 'friend-request-card.component.html',
  styleUrls: [ 'friend-request-card.component.scss' ],
  providers: [FriendShipService]
})

export class FriendRequestCardComponent {
  @Input('friendShip') friendShip: any;

  constructor(private friendship: FriendShipService) {}

  accept(friendUserId, friendshipId) {
    this.friendship.accept(friendUserId, friendshipId);
  }

  ignore(friendUserId, friendshipId) {
    this.friendship.reject(friendUserId, friendshipId);
  }
}
