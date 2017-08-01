import { Component } from '@angular/core';

@Component({
  selector: 'ow-profile-list',
  templateUrl: 'profile-list.component.html',
  styleUrls: ['profile-list.component.scss']
})

export class ProfileListComponent {

  items: number[] = [1, 2, 3, 4];

  constructor() {}

}
