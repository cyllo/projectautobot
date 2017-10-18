import { Component, OnInit } from '@angular/core';
import { GamerTag } from '../../models';
import { ReducerStack, SearchState } from '../../reducers';
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
    private store: Store<ReducerStack>
  ) {}

  ngOnInit() {
    this.store.select('search')
    .subscribe(({ searching, profile }: SearchState) => {
      this.searchResults = profile;
      this.openDisplay = searching;
    });
  }

  onClose() {
    this.openDisplay = false;
  }
}
