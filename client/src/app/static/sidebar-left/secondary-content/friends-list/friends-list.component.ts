import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserService, ClubService } from '../../../../services';
import { Store } from '@ngrx/store';
import { AppState, Club, User } from '../../../../models';
import { Observable } from 'rxjs/Observable';
import { values, path, find, propEq, prop, isNil, filter, length, isEmpty } from 'ramda';
import { DragulaService } from 'ng2-dragula/ng2-dragula';



@Component({
  selector: 'ow-friends-list',
  templateUrl: 'friends-list.component.html',
  styleUrls: [ 'friends-list.component.scss' ],
  providers: [UserService, DragulaService, ClubService]
})

export class SidebarFriendsListComponent implements OnInit {
  openSearchResults: boolean;
  searchInProgress: boolean;
  clubCreationPending: boolean;
  hasFriends: Observable<boolean>;
  questionForm: FormGroup;

  searchResults: User[];


  clubs: Observable<Club[]>;
  clubCount: number;

  constructor(
    private userService: UserService,
    private store: Store<AppState>,
    private dragula: DragulaService,
    private clubService: ClubService
  ) {
    this.clubCreationPending = false;
    this.openSearchResults = false;
    this.searchInProgress = false;
  }

  ngOnInit() {
    this.clubs = this.store.select('clubs').map(clubs => values(clubs));

    this.hasFriends = this.clubs
    .filter(clubs => !isEmpty(clubs))
    .map(clubs => {
      const [generalClub] = filter(propEq('name', 'General'), clubs);
      return length(<any[]>prop('friendships', generalClub)) > 0;
    });

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


  toggleClubCreation() {
    this.clubCreationPending = !this.clubCreationPending;
  }

  onSearch(displayName) {
    this.searchInProgress = true;
    this.userService.find(displayName)
    .subscribe(users => {
      this.searchResults = users;
      this.openSearchResults = true;
      this.searchInProgress = false;
    });
  }
}
