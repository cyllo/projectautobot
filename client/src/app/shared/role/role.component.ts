import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ow-role',
  templateUrl: 'role.component.html',
  styleUrls: ['role.component.scss']
})
export class RoleComponent implements OnInit {
  @Input() heroes;
  @Input() roles;

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello Role');
  }

}
