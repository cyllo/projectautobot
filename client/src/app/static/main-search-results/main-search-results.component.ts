import { Component, OnInit } from '@angular/core';
import { Search, GamerTag, AppState } from '../../models';
import { Store } from '@ngrx/store';

@Component({
  selector: 'ow-main-search-results',
  templateUrl: 'main-search-results.component.html',
  styleUrls: ['main-search-results.component.scss']
})
export class MainSearchResultsComponent implements OnInit {
  openDisplay: boolean;
  searchResults: GamerTag[];

  constructor(
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.store.select('search')
    .subscribe(({searching, profile}: Search) => {
      this.searchResults = profile;
      this.openDisplay = searching;
    });
  }

  onClose() {
    this.openDisplay = false;
  }
}
