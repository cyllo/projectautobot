import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-stat-category-block',
  templateUrl: 'stat-category-block.component.html',
  styleUrls: ['stat-category-block.component.scss']
})
export class StatCategoryBlockComponent implements OnInit {

  statBlocks = [
    {
      name: 'Combat',
      stats: [
        {
          name: 'Eliminations',
          value: 'eliminations'
        },
        {
          name: 'Accuracy',
          value: 'accuracy'
        },
        {
          name: 'Damage Done',
          value: 'damageDone'
        },
        {
          name: 'Healing Done',
          value: 'healingDone'
        },
        {
          name: 'Damage Blocked',
          value: 'damageBlocked'
        },
        {
          name: 'Critical Hits',
          value: 'criticalHits'
        },
        {
          name: 'Objective Kills',
          value: 'objectiveKills'
        }
      ]
    },
    {
      name: 'Game',
      stats: [
        {
          name: 'Gold Medals',
          value: 'goldMedals'
        }
      ]
    }
  ];

  constructor() {}

  ngOnInit() {}

}
