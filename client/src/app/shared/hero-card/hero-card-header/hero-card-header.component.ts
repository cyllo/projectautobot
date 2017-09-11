import { Component, Input } from '@angular/core';

@Component({
  selector: 'ow-hero-card-header',
  templateUrl: 'hero-card-header.component.html',
  styleUrls: [ 'hero-card-header.component.scss' ]
})

export class HeroCardHeaderComponent {
  @Input() hero: any;

  constructor() {}

}
