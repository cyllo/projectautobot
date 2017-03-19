import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-live',
  templateUrl: 'live.component.html',
  styleUrls: ['live.component.scss']
})
export class LiveComponent implements OnInit {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello live');
  }

}
