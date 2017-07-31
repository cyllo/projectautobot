import { Component, Output, EventEmitter } from '@angular/core';
import { NavLink } from '../../../models';

@Component({
  selector: 'ow-user-actions',
  templateUrl: 'user-actions.component.html',
  styleUrls: ['user-actions.component.scss']
})

export class UserActionsComponent {
  @Output() show: EventEmitter<NavLink[]> = new EventEmitter<NavLink[]>();

  navLinks: NavLink[] = [
    {
      name: 'Sign Up',
      routerLink: '/register'
    },
    {
      name: 'Login',
      routerLink: '/login'
    }
  ];

  constructor() {}

  showNavLinksInToolbar() {
    this.show.emit(this.navLinks);
  }

}
