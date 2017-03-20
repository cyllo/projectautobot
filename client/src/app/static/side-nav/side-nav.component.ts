import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-side-nav',
  templateUrl: 'side-nav.component.html',
  styleUrls: ['side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  private _opened: boolean = false;

  constructor() {
    // Do stuff
  }

  _toggleSidebar() {
    this._opened = !this._opened;
  }

  ngOnInit() {
    console.log('Hello side-nav');
  }

}
