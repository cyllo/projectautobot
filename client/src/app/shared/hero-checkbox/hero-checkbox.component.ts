import { Component, Input } from '@angular/core';

@Component({
  selector: 'ow-hero-checkbox',
  templateUrl: 'hero-checkbox.component.html',
  styleUrls: ['hero-checkbox.component.scss']
})
export class HeroCheckboxComponent {
  @Input() owCode: string;

  constructor () {}

}
