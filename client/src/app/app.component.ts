import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { AppState, Player } from './models';
import { searchGamerTag } from './reducers';
import {
  HereosService,
  GamerTagService,
  OverwatchHeroDataService,
  AuthorizationService
} from './services';

import '../style/app.scss';

@Component({
  selector: 'ow-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [HereosService, AuthorizationService]
})
export class AppComponent implements OnDestroy, OnInit {
  sub: Subscription;
  $state: Observable<AppState>;
  searchResults = new Subject<Player[]>();
  isResultsOpen = false;

  constructor(
    private store: Store<AppState>,
    private owHeroData: OverwatchHeroDataService,
    private gamerTagService: GamerTagService,
    private hereosService: HereosService,
    private authService: AuthorizationService) {

    this.$state = this.store.select(s => s);

    this.sub = store.let(searchGamerTag)
      .filter(state => state.searching)
      .do(() => this.searchResults.next([]))
      .switchMap((search) => this.find(search))
      .subscribe(this.searchResults);

    this.getHeroes();

    this.owHeroData.load();
  }

  ngOnInit() {
    this.authService.setCurrentSession(JSON.parse(window.localStorage.getItem('session')));
  }

  onSearch(action) {
    this.isResultsOpen = !!action.payload;
    this.store.dispatch(action);
  }

  find(search) {
    return this.gamerTagService.find(search.tag)
      .do((players) => {
        if (!search.searching) {
          this.store.dispatch({ type: 'ADD_PLAYERS', payload: players });
        }
      });
  }

  getHeroes() {
    return this.hereosService.get()
      .subscribe(s => this.store.dispatch({ type: 'GET_HEROES_DATA', payload: s.data.heroes }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
