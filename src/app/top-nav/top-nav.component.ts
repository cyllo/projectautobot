import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello top-nav');
  }

}
