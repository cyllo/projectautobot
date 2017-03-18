import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello side-nav');
  }

}
