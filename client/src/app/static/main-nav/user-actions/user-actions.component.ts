import { Component } from '@angular/core';

@Component({
  selector: 'ow-user-actions',
  templateUrl: 'user-actions.component.html',
  styleUrls: ['user-actions.component.scss']
})

export class UserActionsComponent {

  navLinks = [
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
