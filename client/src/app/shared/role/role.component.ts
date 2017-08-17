import { Component, Input } from '@angular/core';

@Component({
  selector: 'ow-role',
  templateUrl: 'role.component.html',
  styleUrls: ['role.component.scss']
})
export class RoleComponent {
  @Input() heroes;
  @Input() roles;

  constructor() {
    // Do stuff
  }

}
