import { Component, Input, OnInit } from '@angular/core';
import { CurrentHero } from '../../../models';

@Component({
  selector: 'ow-heroes-table',
  templateUrl: 'heroes-table.component.html',
  styleUrls: ['heroes-table.component.scss']
})

export class HeroesTableComponent implements OnInit {
  showLoadingIndicator = true;
  allowReorder = true;
  rows: Array<CurrentHero>;

  constructor() {}

  @Input()
  set heroes($heroes) {
    if (!$heroes) {
      return;
    }
    this.rows = JSON.parse(JSON.stringify($heroes));
  }

  get heroes() {
    return this.rows;
  }

  getWinRate(row) {
    return parseInt(row.gameHistoryStatistic.gamesWon || 0) / parseInt(row.gameHistoryStatistic.gamesPlayed || 0) * 100;
  }

  getKDRatio(row) {
    return parseInt(row.combatLifetimeStatistic.finalBlows || 0) / parseInt(row.combatLifetimeStatistic.deaths || 0);
  }

  getMedalsPerGame(row) {
    return parseInt(row.gameHistoryStatistic.gamesWon || 0) / parseInt(row.gameHistoryStatistic.gamesPlayed || 0) * 100;
  }

  ngOnInit() {
    // turn off loading indicator after all the data is loaded
    this.showLoadingIndicator = false;
  }

}
