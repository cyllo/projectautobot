import { Component } from '@angular/core';

@Component({
  selector: 'ow-hero-synergy-counter',
  templateUrl: 'hero-synergy-counter.component.html',
  styleUrls: ['hero-synergy-counter.component.scss']
})
export class HeroSynergyCounterComponent {

  public synergies: Array<any> = [0, 1, 2, 3, 4, 5];
  public counters: Array<any> = [0, 1, 2, 3, 4, 5];

  constructor() { }

}
