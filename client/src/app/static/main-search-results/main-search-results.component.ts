import { Component, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Player, Search } from '../../models';
import { AppState } from '../../models/appstate.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { clone } from 'ramda';

@Component({
  selector: 'ow-main-search-results',
  templateUrl: 'main-search-results.component.html',
  styleUrls: ['main-search-results.component.scss']
})
export class MainSearchResultsComponent {
  @Input() searchResults;
  @Input() isOpen: boolean;
  @Output() close = new EventEmitter();

  data$: Observable<AppState>;
  search: Search;

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef, private router: Router) {
    this.data$ = this.store.select(search => search);
    this.data$.subscribe(s => {
      this.search = s.search;
      this.isOpen = this.search.searching;
      this.cd.markForCheck();
    });
  }

  onClose() {
    this.store.dispatch({ type: 'GET_PLAYER_TAG', payload: { searching: false } });
  }

  onSelect(result: Player) {
    result = clone(result);
    result.tag = String(result.tag).replace('#', '-');
    Object.freeze(result);

    let newPayload = Object.assign({}, {[result.region + result.platform]: result});
    console.log('payload: ' , newPayload);
    this.store.dispatch({ type: 'ADD_PLAYER', payload: newPayload });
    this.store.dispatch({ type: 'GET_PLAYER_TAG', payload: { tag: this.search.tag, searching: false } });
    this.redirect(result);
  }

  redirect(data: Player) {
    if (data.region) {
      this.router.navigate(['./profile', data.platform, data.region, data.tag]);
    } else {
      this.router.navigate(['./profile', data.platform, data.tag]);
    }
  }

}
