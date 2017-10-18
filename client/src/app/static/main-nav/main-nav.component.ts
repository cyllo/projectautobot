import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { CurrentSession, NavLink } from '../../models';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { isNil } from 'ramda';
import { GamerTagService } from '../../services';
import { startTagSearch, searchResults, ReducerStack } from '../../reducers';


@Component({
  selector: 'ow-main-nav',
  templateUrl: 'main-nav.component.html',
  styleUrls: ['main-nav.component.scss']
})

export class MainNavComponent implements OnInit {
  @Input('navLinks') navLinks: NavLink[];

  searchInProgress = false;
  private currentSession: Observable<CurrentSession>;
  userLoggedIn: boolean;
  searchPlaceholder = 'Search for player by battle tag, psn or xbox live';
  onSearch$ = new Subject<string>();

  constructor(
    private store: Store<ReducerStack>,
    private gamerTagService: GamerTagService) {}

  ngOnInit() {
    this.currentSession = this.store.select('currentSession');

    this.currentSession
    .map(session => !isNil(session))
    .subscribe(session => {
      this.userLoggedIn = session;
    });

    this.onSearch$
    .do(() => {
      this.searchInProgress = true;
      this.store.dispatch(startTagSearch());
    })
    .switchMap(tag => this.gamerTagService.find(tag))
    .subscribe(results => {
      this.searchInProgress = false;
      this.store.dispatch(searchResults(results));
    });
  }

}
