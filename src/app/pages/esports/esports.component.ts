import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-esports',
  templateUrl: 'esports.component.html',
  styleUrls: ['esports.component.scss']
})
export class ESportsComponent implements OnInit {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello E-Sports');
  }

}
