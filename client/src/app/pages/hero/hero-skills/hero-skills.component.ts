import { Component, Input } from '@angular/core';
import { CurrentHero } from '../../../models';

@Component({
  selector: 'ow-hero-skills',
  templateUrl: 'hero-skills.component.html',
  styleUrls: ['hero-skills.component.scss']
})
export class HeroSkillsComponent {

  public skills: Array<any> = [0, 1, 2, 3];

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
    return this._currentHero;
  }

}
