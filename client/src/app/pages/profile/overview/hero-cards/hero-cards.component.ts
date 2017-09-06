import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-hero-cards',
  templateUrl: 'hero-cards.component.html',
  styleUrls: [ 'hero-cards.component.scss' ]
})

export class HeroCardsComponent implements OnInit {

  heroes = [1, 2, 3, 4, 5];

  constructor() {}

  ngOnInit() {}

}
