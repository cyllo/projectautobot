import { Component, Input } from '@angular/core';

@Component({
  selector: 'ow-recently-played',
  templateUrl: 'recently-played.component.html',
  styleUrls: [ 'recently-played.component.scss' ]
})

export class RecentlyPlayedComponent {
  @Input() recentlyPlayed: any;
  constructor() {}

}
