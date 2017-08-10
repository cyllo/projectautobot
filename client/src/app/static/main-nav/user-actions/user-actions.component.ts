import { Component } from '@angular/core';
import { NavLink } from '../../../models';

@Component({
  selector: 'ow-user-actions',
  templateUrl: 'user-actions.component.html',
  styleUrls: ['user-actions.component.scss']
})

export class UserActionsComponent {

  navLinks: NavLink[] = [
    {
      name: 'Sign Up',
      routerLink: '/register',
      materialIcon: 'account_box'
    },
    {
      name: 'Login',
      routerLink: '/login',
      materialIcon: 'input'
    }
  ];

  constructor() {}

}
