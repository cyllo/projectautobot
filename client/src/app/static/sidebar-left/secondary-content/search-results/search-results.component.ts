import { Component, Input } from '@angular/core';
import { User } from '../../../../models';
import { FriendShipService } from '../../../../services';



@Component({
  selector: 'ow-search-results',
  templateUrl: 'search-results.component.html',
  styleUrls: [ 'search-results.component.scss' ],
  providers: [FriendShipService]
})

export class SearchResultsComponent {

  @Input() searchResults: User[];
  constructor(private friendShip: FriendShipService) {}

  sendFriendRequest(id: number) {
    this.friendShip.request(id);
  }
}
