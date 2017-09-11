import { Component, Input } from '@angular/core';

@Component({
  selector: 'ow-match-details',
  templateUrl: 'match-details.component.html',
  styleUrls: ['match-details.component.scss']
})

export class MatchDetailsComponent {
  @Input() snapshot: any;

  constructor() {}

}
