import { Component } from '@angular/core';

@Component({
  selector: 'ow-hero-counters',
  templateUrl: 'counters.component.html',
  styleUrls: ['counters.component.scss']
})
export class HeroCountersComponent {

  counters = ['0x02E0000000000002', '0x02E000000000006E', '0x02E000000000012E', '0x02E0000000000003'];

  constructor() {}

}
