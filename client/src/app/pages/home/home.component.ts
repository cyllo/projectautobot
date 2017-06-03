import { Component, OnInit, AfterContentInit } from '@angular/core';

@Component({
  selector: 'ow-home',
  templateUrl: 'home.component.html',
  styleUrls: [ 'home.component.scss' ]
})

export class HomeComponent implements OnInit, AfterContentInit {

  public heroData: any;

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
