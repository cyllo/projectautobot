import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models';
import { FollowService } from '../../services';

@Component({
  selector: 'ow-followed-user',
  templateUrl: 'followed-user.component.html',
  styleUrls: ['following.component.scss'],
  providers: [FollowService]
})
export class FollowedUserComponent implements OnInit {
  @Input() followedUser: User;

  constructor(private followService: FollowService) {}

  ngOnInit() {}

  unfollow(userId) {
    this.followService.unfollowUser(userId);
  }
}
