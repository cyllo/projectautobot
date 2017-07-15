import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-list-of-compareable-heroes',
  templateUrl: 'list-of-compareable-heroes.component.html',
  styleUrls: ['list-of-compareable-heroes.component.scss']
})
export class ListOfCompareableHeroesComponent implements OnInit {

  availableHeroes = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor() {}

  ngOnInit() {}

}
