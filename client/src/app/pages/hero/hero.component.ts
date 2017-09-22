import { Component } from '@angular/core';

@Component({
  selector: 'ow-hero',
  templateUrl: 'hero.component.html',
  styleUrls: [ 'hero.component.scss' ]
})

export class HeroComponent {

  platforms: { name: string }[] = [{ name: 'pc'}, { name: 'xbl' }, { name: 'psn' }];
  regions: { name: string }[] = [{ name: 'us' }, { name: 'eu' }, { name: 'kr' }, { name: 'ch'}];

  constructor() {}

}
