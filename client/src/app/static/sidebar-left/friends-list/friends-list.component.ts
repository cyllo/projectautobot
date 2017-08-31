import { Component, OnInit } from '@angular/core';
import { UserService, ClubService, FriendShipService, notEmpty } from '../../../services';
import { Store } from '@ngrx/store';
import { AppState, Club } from '../../../models';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { values, path, find, propEq, prop, isNil, filter, length, isEmpty, propOr } from 'ramda';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { startSideBarSearch, completeSideBarSearch } from '../../../reducers';

@Component({
  selector: 'ow-friends-list',
  templateUrl: 'friends-list.component.html',
  styleUrls: ['friends-list.component.scss'],
  providers: [UserService, DragulaService, ClubService, FriendShipService]
})

export class SidebarFriendsListComponent implements OnInit {
  hasFriends: Observable<boolean>;
  toggleClubCreation$ = new Subject<boolean>();
  onSearch$ = new Subject<string>();
  sideBarSearchResults: Observable<any>;
  destroyer$ = new Subject();
  generalClub: Observable<Club>;

  clubs: Observable<Club[]>;

  constructor(
    private store: Store<AppState>,
    private dragula: DragulaService,
    private clubService: ClubService,
    private friendshipService: FriendShipService
  ) {}

  ngOnInit() {
    this.clubs = this.store.select('clubs').map(clubs => values(clubs)).skipWhile(isEmpty);

    this.toggleClubCreation$.startWith(false);

    this.sideBarSearchResults = this.store.select('sideBarSearchResults').share();

    this.generalClub = this.clubs
    .map(clubs => {
      const [generalClub] = filter(propEq('name', 'General'), clubs);
      return generalClub;
    });

    this.hasFriends = this.generalClub
    .takeWhile(notEmpty)
    .map(generalClub => length(<any[]>propOr([], 'friendships', generalClub)) > 0)
    .defaultIfEmpty(false);

    this.onSearch$.do(() => this.store.dispatch(startSideBarSearch()))
    .switchMap((displayName: string) => this.friendshipService.search(displayName))
    .subscribe(users => this.store.dispatch(completeSideBarSearch(users)));

    this.dragula.setOptions('bag-one', {
      copy: true,
      copySortSource: false,
      revertOnSpill: true
    });

    this.dragula.drop.withLatestFrom(this.store.select('clubs'), ([, target, destination, source], clubs) => {
      const friendshipId: number = parseInt(<string>path(['dataset', 'id'], target), 10);
      const destinationClubId: number = parseInt(<string>path(['dataset', 'id'], destination), 10);
      const sourceClubId: number = parseInt(<string>path(['dataset', 'id'], source), 10);
      const dupe = find(propEq('id', friendshipId), <any[]>prop('friendships', clubs[destinationClubId]));

      if (!dupe && destination && sourceClubId !== destinationClubId) {
        const friendship = find(propEq('id', friendshipId), <any[]>prop('friendships', clubs[sourceClubId]));
        return { friendship, destinationClubId };
      } else {
        this.dragula.find('bag-one').drake.cancel(true);
      }
    })
    .filter(res => !isNil(res))
    .subscribe(({ friendship, destinationClubId }) => this.clubService.addFriendship(friendship, destinationClubId));
  }
}
