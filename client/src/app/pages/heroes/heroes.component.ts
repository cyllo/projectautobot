import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-heroes',
  templateUrl: 'heroes.component.html',
  styleUrls: ['heroes.component.scss']
})

export class HeroesComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

  onScrollDown() {
    console.log('reached bottom of page so loading more data');
  }

}
