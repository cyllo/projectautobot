import { Component } from '@angular/core';

@Component({
  selector: 'ow-match-details',
  templateUrl: 'match-details.component.html',
  styleUrls: ['match-details.component.scss']
})

export class MatchDetailsComponent {

  heroesPlayed = [1, 2, 3, 4, 5, 6, 7, 8];

  stats = [
    {
      name: 'Eliminations',
      value: '0.25/min'
    },
    {
      name: 'Kills',
      value: '0.25/min'
    },
    {
      name: 'Solo Kills',
      value: '0.25/min'
    },
    {
      name: 'Objective Kills',
      value: '0.25/min'
    },
    {
      name: 'Offensive Assists',
      value: '0.25/min'
    },
    {
      name: 'Defensive Assists',
      value: '0.25/min'
    },
    {
      name: 'Deaths',
      value: '0.25/min'
    },
    {
      name: 'Accuracy',
      value: '0.25/min'
    },
    {
      name: 'Crits',
      value: '0.25/min'
    },
    {
      name: 'Kill Streak',
      value: '3'
    },
    {
      name: 'K/D Ratio',
      value: '2.0:1'
    },
    {
      name: 'All Damage',
      value: '0.25/min'
    },
    {
      name: 'Hero Damage',
      value: '0.25/min'
    },
    {
      name: 'Barrier Damage',
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
      name: 'Time on fire',
      value: '0.25min'
    },
    {
      name: 'Medals',
      value: '0.25/min'
    },
    {
      name: 'Objective Time',
      value: '0.25min'
    },
    {
      name: 'Game Length',
      value: '0.25min'
    }
  ];

  constructor() {}

}
