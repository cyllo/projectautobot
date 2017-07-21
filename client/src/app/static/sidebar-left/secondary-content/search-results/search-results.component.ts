import { Component } from '@angular/core';

@Component({
  selector: 'ow-search-results',
  templateUrl: 'search-results.component.html',
  styleUrls: [ 'search-results.component.scss' ]
})

export class SearchResultsComponent {

  items: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  constructor() {}

}
