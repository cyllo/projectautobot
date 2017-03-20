import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ow-role',
  templateUrl: 'role.component.html',
  styleUrls: ['role.component.scss']
})
export class RoleComponent implements OnInit {
  @Input() heroes;
  public fieldName = 'OFFENSE';
  public plays = '43,253,891';
  public percentage = 25;

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello Role');
  }

}
