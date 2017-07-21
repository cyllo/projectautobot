import { Component } from '@angular/core';
import { NavLink } from '../../../models';

@Component({
  selector: 'ow-nav-list',
  templateUrl: 'nav-list.component.html',
  styleUrls: ['nav-list.component.scss']
})

export class NavListComponent {

  navLinks: NavLink[] = [
    {
      name: 'News',
      routerLink: '/news'
    },
    {
      name: 'Leaderboard',
      routerLink: '/leaderboard'
    },
    {
      name: 'Heroes',
      routerLink: '/heroes'
    },
    {
      name: 'Following',
      routerLink: '/following'
    }
  ];

  constructor() {}

  firstTwoNavLinks() {
    return this.navLinks.slice(0, 2);
  }

  remainingNavLinks() {
    return this.navLinks.slice(2);
  }

}
