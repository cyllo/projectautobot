import { Component, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Player, Search } from '../../models';
import { AppState } from '../../models/appstate.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ProfileService } from '../../services';

@Component({
  selector: 'ow-main-search-results',
  templateUrl: 'main-search-results.component.html',
  styleUrls: ['main-search-results.component.scss'],
  providers: [ProfileService]
})
export class MainSearchResultsComponent {
  @Input() searchResults;
  @Input() isOpen: boolean;
  @Output() close = new EventEmitter();
  @Output() isOpenChange = new EventEmitter();

  data$: Observable<AppState>;
  search: Search;

  constructor(private store: Store<AppState>,
    private cd: ChangeDetectorRef,
    private profileService: ProfileService
  ) {
    this.data$ = this.store.select(search => search);
    this.data$.subscribe(s => {
      this.search = s.search;
      this.cd.markForCheck();
    });
  }

  onClose() {
    this.isOpenChange.emit(false);
    this.store.dispatch({ type: 'GET_PLAYER_TAG', payload: { searching: false } });
  }

  onSelect(result: Player) {
    this.store.dispatch({ type: 'ADD_PLAYERS', payload: [result] });
    this.store.dispatch({ type: 'GET_PLAYER_TAG', payload: { tag: this.search.tag, searching: false } });
    this.profileService.goto(result);
  }
}
