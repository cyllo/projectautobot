import { Component, OnInit } from '@angular/core';
import { AppState, User, GamerTag } from '../../models';
import { Store } from '@ngrx/store';
import { values } from 'ramda';
import { Observable } from 'rxjs';

@Component({
  selector: 'ow-following',
  templateUrl: 'following.component.html',
  styleUrls: ['following.component.scss']
})
export class FollowingComponent implements OnInit {

  followedUsers: Observable<User[]>;
  followedGamerTags: Observable<GamerTag[]>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.followedUsers = this.store.select('followedUsers').map(following => <User[]>values(following));
    this.followedGamerTags = this.store.select('followedGamerTags').map(followedGamerTags => <GamerTag[]>values(followedGamerTags));
  }
}
