import { Component } from '@angular/core';

@Component({
  selector: 'ow-match-snapshot',
  templateUrl: 'match-snapshot.component.html',
  styleUrls: ['match-snapshot.component.scss']
})

export class MatchSnapshotComponent {

  heroesPlayed = [1, 2, 3, 4, 5, 6, 7, 8];

  stats = [
    {
      name: 'Eliminations',
      value: '0.25/min'
    },
    {
      name: 'K/D Ratio',
      value: '0.25/min'
    },
    {
      name: 'Hero Damage',
      value: '0.25/min'
    },
    {
      name: 'Blocked',
      value: '0.25/min'
    },
    {
      name: 'Healing',
      value: '0.25/min'
    },
    {
      name: 'Medals',
      value: '0.25/min'
    }
  ];

  constructor() {}

}
