import { Component, OnInit, Input } from '@angular/core';
import { GamerTag } from '../../models';
import { FollowService } from '../../services';

@Component({
  selector: 'ow-gamer-tag-card',
  templateUrl: 'gamer-tag-card.component.html',
  styleUrls: ['following.component.scss'],
  providers: [FollowService]
})
export class GamerTagCardComponent implements OnInit {
  @Input() gamerTag: GamerTag;
  @Input() profileMode: boolean;

  constructor(private followService: FollowService) {}

  ngOnInit() {}

  unfollow(gamertagId: number) {
    this.followService.unfollowGamerTag(gamertagId);
  }
}
