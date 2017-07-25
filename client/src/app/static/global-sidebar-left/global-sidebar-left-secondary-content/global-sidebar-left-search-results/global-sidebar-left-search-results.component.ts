import { Component, Input } from '@angular/core';
import { User } from '../../../../models';
import { FriendShipService } from '../../../../services';

@Component({
  selector: 'ow-global-sidebar-left-search-results',
  templateUrl: 'global-sidebar-left-search-results.component.html',
  styleUrls: ['global-sidebar-left-search-results.component.scss'],
  providers: [FriendShipService]
})

export class GlobalSideBarLeftSearchResultsComponent {
  @Input() searchResults: User[];
  constructor(private friendShip: FriendShipService) {}

  sendFriendRequest(id: number) {
    console.log('this id?', id)
    this.friendShip.request(id)
  }

}
