import { Component, Input } from '@angular/core';
import { CurrentHero } from '../../../models';

@Component({
  selector: 'ow-hero-page-tabs',
  templateUrl: 'hero-page-tabs.component.html',
  styleUrls: ['hero-page-tabs.component.scss']
})

export class HeroPageTabsComponent {
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
