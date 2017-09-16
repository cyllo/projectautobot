import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { chain, filter } from 'ramda';

interface StatBlock {
  name: string;
  stats: StatCategory[];
}

interface StatCategory {
  name: string;
  value: string;
  selected: boolean;
}

@Component({
  selector: 'ow-stat-category-block',
  templateUrl: 'stat-category-block.component.html',
  styleUrls: ['stat-category-block.component.scss']
})
export class StatCategoryBlockComponent implements OnInit {
  @Output() change = new EventEmitter<StatCategory[]>();

  selected: StatCategory[];

  statBlocks: StatBlock[] = [
    {
      name: 'Combat',
      stats: [
        {
          name: 'Eliminations',
          value: 'eliminations',
          selected: true
        },
        {
          name: 'K/D Ratio',
          value: 'eliminationsPerLife',
          selected: false
        },
        {
          name: 'Accuracy',
          value: 'weaponAccuracyPercentage',
          selected: false
        },
        {
          name: 'Damage Blocked',
          value: 'damageBlocked',
          selected: false
        },
        {
          name: 'Healing Done',
          value: 'healingDone',
          selected: false
        },
        {
          name: 'Critical Hits',
          value: 'criticalHits',
          selected: false
        },
        {
          name: 'Damage Done',
          value: 'allDamageDone',
          selected: false
        },
        {
          name: 'Objective Kills',
          value: 'objectiveKills',
          selected: false
        },
        {
          name: 'Objective Time',
          value: 'objectiveTime',
          selected: false
        }
      ]
    }
  ];

  constructor() {}

  ngOnInit() {
    this.selected = this.collectSelected();
    this.change.emit(this.selected);
  }

  onChangeSelected() {
    this.selected = this.collectSelected();
    this.change.emit(this.selected);
  }

  collectSelected() {
    return chain(statBlock => filter(stat => stat.selected, statBlock.stats), this.statBlocks);
  }
}
