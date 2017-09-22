import { Component } from '@angular/core';

@Component({
  selector: 'ow-hero-synergies',
  templateUrl: 'synergies.component.html',
  styleUrls: ['synergies.component.scss']
})
export class HeroSynergiesComponent {
  synergies = ['0x02E0000000000029', '0x02E0000000000042', '0x02E0000000000008', '0x02E0000000000002'];

  constructor() {}

}
