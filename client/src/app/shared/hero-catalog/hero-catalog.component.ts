import { Component, Input } from '@angular/core';
import { CurrentHero } from '../../models';

@Component({
  selector: 'ow-hero-catalog',
  templateUrl: 'hero-catalog.component.html',
  styleUrls: ['hero-catalog.component.scss']
})
export class HeroCatalogComponent {

  public heroCatalog: Array<any> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
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
