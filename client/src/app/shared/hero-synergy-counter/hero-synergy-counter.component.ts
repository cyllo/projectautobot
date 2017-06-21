import { Component, Input } from '@angular/core';
import { CurrentHero } from '../../models';

@Component({
  selector: 'ow-hero-synergy-counter',
  templateUrl: 'hero-synergy-counter.component.html',
  styleUrls: ['hero-synergy-counter.component.scss']
})
export class HeroSynergyCounterComponent {

  public synergies: Array<any> = [0, 1, 2, 3, 4, 5];
  public counters: Array<any> = [0, 1, 2, 3, 4, 5];
  _currentHero: CurrentHero;

  constructor() {}

  @Input()
  set currentHero($currentHero) {
    if (!$currentHero) {
      return;
    }
    this._currentHero = $currentHero;
  }

  get currentHero() {
    return this._currentHero
  }

}
