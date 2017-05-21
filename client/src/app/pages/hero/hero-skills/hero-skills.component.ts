import { Component } from '@angular/core';

@Component({
  selector: 'ow-hero-skills',
  templateUrl: 'hero-skills.component.html',
  styleUrls: ['hero-skills.component.scss']
})
export class HeroSkillsComponent {

  public skills: Array<any> = [0,1,2,3];

  constructor() { }

}
