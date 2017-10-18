import { Component, OnInit, OnDestroy } from '@angular/core';
import { GamerTag } from '../../../models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter, propEq, values, isNil, isEmpty } from 'ramda';
import { FriendShipService, notNil, ProfileService } from '../../../services';
import { ReducerStack } from '../../../reducers';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'ow-friend-requests',
  templateUrl: 'friend-requests.component.html',
  styleUrls: [ 'friend-requests.component.scss' ],
  providers: [FriendShipService, ProfileService]
})

export class FriendRequestsComponent implements OnInit, OnDestroy {

  friendRequests: Observable<any>;
  gotoProfile$ = new Subject<GamerTag>();
  destroyer$ = new Subject<void>();

  constructor(
    private store: Store<ReducerStack>,
    private friendship: FriendShipService,
    private profile: ProfileService
  ) {}

  ngOnInit() {
    this.friendRequests = this.store.select('friendships')
    .map(friendships => filter(propEq('isAccepted', false), values(friendships)))
    .skipWhile(isNil)
    .skipWhile(isEmpty)
    .takeUntil(this.destroyer$);

    this.gotoProfile$
    .filter(notNil)
    .takeUntil(this.destroyer$)
    .subscribe((profile: GamerTag) => this.profile.goto(profile));
  }

  ngOnDestroy() {
    this.destroyer$.next();
    this.destroyer$.complete();
  }

  accept(friendUserId, friendshipId) {
    this.friendship.accept(friendUserId, friendshipId);
  }

  ignore(friendUserId, friendshipId) {
    this.friendship.reject(friendUserId, friendshipId);
  }
}
