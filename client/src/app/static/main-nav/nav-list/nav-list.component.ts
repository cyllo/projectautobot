import { Component, OnInit } from '@angular/core';
import { NavLink, AppState } from '../../../models';
import { Store } from '@ngrx/store';
import { take, takeLast, filter, propEq } from 'ramda';

@Component({
  selector: 'ow-nav-list',
  templateUrl: 'nav-list.component.html',
  styleUrls: ['nav-list.component.scss']
})

export class NavListComponent implements OnInit {

  navLinks: NavLink[] = [
    {
      name: 'News',
      routerLink: '/news'
    },
    {
      name: 'Following',
      routerLink: '/following'
    },
    {
      name: 'Leaderboard',
      routerLink: '/leaderboard'
    }
    // {
    //   name: 'Heroes',
    //   routerLink: '/heroes'
    // },
    // {
    //   name: 'Following',
    //   routerLink: '/following'
    // }
  ];

  firstTwo: NavLink[];
  remaining: NavLink[];

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.select('currentSession').subscribe(currentSession => {
        const authSafe = currentSession
        ? this.navLinks
        : filter(navLink => !propEq('name', 'Following', navLink), this.navLinks);

        this.firstTwo = take(2, authSafe);
        this.remaining = takeLast(2, authSafe);
    });
  }
}
