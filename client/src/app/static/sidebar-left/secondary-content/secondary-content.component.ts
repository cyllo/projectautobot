import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../models';
import { length, filter, propEq, values, find, prop, isEmpty } from 'ramda';

@Component({
  selector: 'ow-secondary-content',
  templateUrl: 'secondary-content.component.html',
  styleUrls: ['secondary-content.component.scss']
})

export class SecondaryContentComponent implements OnInit {

  friendsCount: any;
  friendRequestCount: number;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.friendsCount = this.store.select('clubs')
    .filter(clubs => !isEmpty(clubs))
    .map(clubs => {
      const club = find(propEq('name', 'General'), values(clubs));
      return length(<any[]>prop('friendships', club));
    });

    this.store.select('friendships')
    .map(friendships => filter(propEq('isAccepted', false), values(friendships)))
    .subscribe(friendRequests => {
      this.friendRequestCount = length(friendRequests);
    });
  }
}
