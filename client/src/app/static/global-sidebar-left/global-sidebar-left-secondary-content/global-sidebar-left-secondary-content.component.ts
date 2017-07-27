import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services';
import { Store } from '@ngrx/store';
import { AppState } from '../../../models';
import { keys, length } from 'ramda';

@Component({
  selector: 'ow-global-sidebar-left-secondary-content',
  templateUrl: 'global-sidebar-left-secondary-content.component.html',
  styleUrls: [ 'global-sidebar-left-secondary-content.component.scss' ],
  providers: [UserService]
})

export class GlobalSideBarLeftSecondaryContentComponent implements OnInit {

  friendRequestCount: number;
  
  constructor(private userService: UserService, private store: Store<AppState>) {}


  ngOnInit() {
    this.userService.listFriendRequests();

    this.store.select('friendships')
    .subscribe(friendRequests => {
      this.friendRequestCount = length(keys(friendRequests));
    });
  }

}
