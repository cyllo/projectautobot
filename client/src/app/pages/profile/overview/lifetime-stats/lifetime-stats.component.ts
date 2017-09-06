import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-lifetime-stats',
  templateUrl: 'lifetime-stats.component.html',
  styleUrls: [ 'lifetime-stats.component.scss' ]
})

export class LifetimeStatsComponent implements OnInit {

  statsGroups = [
    {
      groupName: 'Overview',
      stats: [
        {
          name: 'Games Played',
          value: 176
        },
        {
          name: 'Games Won',
          value: 176
        },
        {
          name: 'Total Game Time',
          value: 176
        },
        {
          name: 'Average Game Length',
          value: 176
        },
      ]
    },
    {
      groupName: 'Combat',
      stats: [
        {
          name: 'Eliminations',
          value: 176
        },
        {
          name: 'Deaths',
          value: 176
        },
        {
          name: 'K/D Ratio',
          value: 176
        },
        {
          name: 'Accuracy',
          value: 176
        },
        {
          name: 'Damage Done',
          value: 176
        },
        {
          name: 'Damage Blocked',
          value: 176
        },
        {
          name: 'Healing Done',
          value: 176
        }
      ]
    }
  ];

  constructor() {}

  ngOnInit() {}

}
