import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThemeingService, AppTheme } from '../../services';
import { NavLink } from '../../models';
import { ReducerStack } from '../../reducers';
import { isNil, length, filter, propEq, values, find, prop, isEmpty } from 'ramda';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ow-sidebar-left',
  templateUrl: 'sidebar-left.component.html',
  styleUrls: [ 'sidebar-left.component.scss' ],
  providers: [ThemeingService]
})

export class SideBarLeftComponent implements OnInit {
  @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('navLinks') navLinks: NavLink[];

  appThemesCatalog: AppTheme[];
  friendsCount: any;
  friendRequestCount: number;
  userLoggedIn: Observable<boolean>;

  constructor(private store: Store<ReducerStack>,
    private themeingService: ThemeingService) {
  }

  ngOnInit() {
    this.appThemesCatalog = Object.values(this.themeingService.themes());

    this.userLoggedIn = this.store.select('currentSession')
    .map(currentSession => !isNil(currentSession));

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

  loadTheme(theme: AppTheme) {
    this.themeingService.loadTheme(theme);
  }

}
