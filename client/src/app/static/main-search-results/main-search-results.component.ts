import { Component, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Search } from '../../models';
import { AppState } from '../../models/appstate.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ow-main-search-results',
  templateUrl: 'main-search-results.component.html',
  styleUrls: ['main-search-results.component.scss']
})
export class MainSearchResultsComponent {
  @Input() searchResults;
  @Input() isOpen: boolean;
  @Output() close = new EventEmitter();
  @Output() isOpenChange = new EventEmitter();

  data$: Observable<AppState>;
  search: Search;

  constructor(private store: Store<AppState>,
    private cd: ChangeDetectorRef
  ) {
    this.data$ = this.store.select(search => search);
    this.data$.subscribe(s => {
      this.search = s.search;
      this.cd.markForCheck();
    });
  }

  onClose() {
    this.isOpenChange.emit(false);
  }
}
