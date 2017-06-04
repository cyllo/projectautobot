import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-heroes-table',
  templateUrl: 'heroes-table.component.html',
  styleUrls: ['heroes-table.component.scss']
})

export class HeroesTableComponent implements OnInit {

  showLoadingIndicator: boolean = true;
  allowReorder: boolean = true;

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

  constructor() {}

  ngOnInit() {
    // turn off loading indicator after all the data is loaded
    this.showLoadingIndicator = false;
  }

}
