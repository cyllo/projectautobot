import { Component, Input } from '@angular/core';
import { CurrentHero } from '../../../models/player.model';

@Component({
  selector: 'ow-hero-header',
  templateUrl: 'hero-header.component.html',
  styleUrls: ['hero-header.component.scss']
})
export class HeroHeaderComponent {
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
