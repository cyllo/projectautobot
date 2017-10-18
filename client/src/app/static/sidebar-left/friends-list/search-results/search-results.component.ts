import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { FriendShipService, ProfileService, notNil } from '../../../../services';
import { User, GamerTag } from '../../../../models';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { toggleDisplaySideBarSearch, updateSideBarSearch, ReducerStack } from '../../../../reducers';


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
  gotoProfile$ = new Subject<GamerTag>();

  constructor(
    private friendShip: FriendShipService,
    private profile: ProfileService,
    private store: Store<ReducerStack>
  ) {}

  ngOnInit() {
    this.searchResults = this.store.select('sideBarSearchResults')
    .pluck('users')
    .takeUntil(this.destroyer$);

    this.toggleDisplay$.takeUntil(this.destroyer$).subscribe(() => this.store.dispatch(toggleDisplaySideBarSearch()));

    this.gotoProfile$.filter(notNil).subscribe((profile: GamerTag) => this.profile.goto(profile));

    this.addFriend$
    .switchMap(id => this.friendShip.request(id))
    .withLatestFrom(this.searchResults, ({ friendId }, users) => {
      return <User[]>map(user => assoc('pending', propEq('id', friendId, user), user), users);
    })
    .takeUntil(this.destroyer$)
    .subscribe(users => this.store.dispatch(updateSideBarSearch(users)));
  }

  ngOnDestroy() {
    this.destroyer$.next();
    this.destroyer$.complete();
  }

}
