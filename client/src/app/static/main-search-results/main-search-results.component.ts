import { Component, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Player, Search } from '../../models';
import { AppState } from '../../models/appstate.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

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
  player;

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef, private router: Router) {
    this.data$ = this.store.select(search => search);
    this.data$.subscribe(s => {
      this.search = s.search;
      this.isOpen = this.search.searching;
      let tag = Object.keys(s.players);

      this.player = s.players[tag[0]];
      this.cd.markForCheck();
    });
  }

  onClose() {
    this.store.dispatch({ type: 'GET_PLAYER_TAG', payload: { searching: false } });
  }

  onSelect(result: Player) {
    this.store.dispatch({ type: 'GET_PLAYER_TAG', payload: { tag: this.search.tag, searching: false } });
    this.store.dispatch({
      type: 'GET_SNAPSHOT_DATA',
      payload: this.player.snapshotStatistics[this.player.snapshotStatistics.length - 1]
    });
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
