import { Component, Input } from '@angular/core';

@Component({
  selector: 'ow-hero-overview',
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.component.scss']
})
export class HeroOverviewComponent {
  @Input() heroStats: any;
  @Input() heroTotals: any;
  constructor() { }

}
