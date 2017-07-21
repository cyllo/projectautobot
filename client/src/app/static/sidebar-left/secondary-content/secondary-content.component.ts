import { Component } from '@angular/core';


@Component({
  selector: 'ow-secondary-content',
  templateUrl: 'secondary-content.component.html',
  styleUrls: ['secondary-content.component.scss']
})

export class SecondaryContentComponent {

  friendsCount = 5;
  friendRequestsCount = 1;

  constructor() {}

}
