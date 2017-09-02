import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-list-of-compareable-heroes',
  templateUrl: 'list-of-compareable-heroes.component.html',
  styleUrls: ['list-of-compareable-heroes.component.scss']
})
export class ListOfCompareableHeroesComponent implements OnInit {

  availableHeroes = [];

  constructor() {}

  ngOnInit() {
    for (let i = 0; i < 24; ++i) {
      this.availableHeroes.push({ code: '0x02E0000000000029' });
    }
  }

}
