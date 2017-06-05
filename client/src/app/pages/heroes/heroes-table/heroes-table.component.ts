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

  rows = [
    {
      index: '1',
      name : 'Mercy' ,
      popularity: '7.32',
      winrate: '1',
      kdratio: '0',
      medals: '2'
    }
  ];

  _heroes: Array<CurrentHero>;

  constructor() {}

  @Input()
  set heroes($heroes) {
    if (!$heroes) {
      return;
    }
    this._heroes = $heroes;
  }

  get heroes() {
    return this._heroes
  }

  ngOnInit() {
    // turn off loading indicator after all the data is loaded
    this.showLoadingIndicator = false;
  }

}
