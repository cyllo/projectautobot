import { Component } from '@angular/core';

@Component({
  selector: 'ow-hero-list',
  templateUrl: 'hero-list.component.html',
  styleUrls: ['hero-list.component.scss']
})
export class HeroListComponent {

  public heroes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  constructor() {}

}
