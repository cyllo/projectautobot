import { Component, OnInit, AfterContentInit } from '@angular/core';

@Component({
  selector: 'ow-page-not-found',
  templateUrl: '404.component.html',
  styleUrls: [ '404.component.scss' ]
})

export class PageNotFoundComponent implements OnInit, AfterContentInit {

  constructor() {}

  ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
  }

  ngAfterContentInit() {
    // Called after ngOnInit when the component's or directive's content has been initialized.
    // Add 'implements AfterContentInit' to the class.
  }

}
