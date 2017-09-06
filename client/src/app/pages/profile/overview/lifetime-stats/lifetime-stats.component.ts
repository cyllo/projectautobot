import { Component, Input } from '@angular/core';
import { GameHistoryStats, CombatLifetimeStats } from '../../../../models';

@Component({
  selector: 'ow-lifetime-stats',
  templateUrl: 'lifetime-stats.component.html',
  styleUrls: [ 'lifetime-stats.component.scss' ]
})

export class LifetimeStatsComponent {
  @Input() lifetimeStats: CombatLifetimeStats;
  @Input() gameHistory: GameHistoryStats;

  constructor() {}
}
