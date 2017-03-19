import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-friends',
  templateUrl: 'friends.component.html',
  styleUrls: ['friends.component.scss']
})
export class FriendsComponent implements OnInit {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello friends');
  }

}
