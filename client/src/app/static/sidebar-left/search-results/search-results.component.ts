import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { FriendShipService, ProfileService } from '../../../services';
import { AppState, User } from '../../../models';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { toggleDisplaySideBarSearch, updateSideBarSearch } from '../../../reducers';
import { propEq, assoc, map } from 'ramda';

@Component({
  selector: 'ow-search-results',
  templateUrl: 'search-results.component.html',
  styleUrls: [ 'search-results.component.scss' ],
  providers: [FriendShipService, ProfileService]
})

export class SearchResultsComponent implements OnInit, OnDestroy {
  searchResults: Observable<any>;
  toggleDisplay$ = new Subject();
  destroyer$ = new Subject();
  addFriend$ = new Subject<number>();
  constructor(
    private friendShip: FriendShipService,
    private profile: ProfileService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.searchResults = this.store.select('sideBarSearchResults')
    .pluck('users')
    .takeUntil(this.destroyer$);

    this.toggleDisplay$.subscribe(() => this.store.dispatch(toggleDisplaySideBarSearch()));

    // when a friend ship request is sent the search results store needs to be updated to show the pending
    // request status
    this.addFriend$
    .switchMap(id => this.friendShip.request(id))
    .withLatestFrom(this.searchResults, ({ friendId }, users) => {
      return <User[]>map(user => assoc('pending', propEq('id', friendId, user), user), users);
    })
    .subscribe(users => this.store.dispatch(updateSideBarSearch(users)));
  }

  ngOnDestroy() {
    this.destroyer$.next();
    this.destroyer$.complete();
  }

  goto(profile) {
    this.profile.goto(profile);
  }
}
