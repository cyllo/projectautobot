import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { AppState, Player } from './models';
import { searchGamerTag } from './reducers';
import { MdIconRegistry } from '@angular/material';

import {
  HereosService,
  GamerTagService,
  OverwatchHeroDataService,
  AuthorizationService,
  NewsService,
  ThemeingService
} from './services';

import '../style/app.scss';

@Component({
  selector: 'ow-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [HereosService, AuthorizationService, NewsService, ThemeingService]
})
export class AppComponent implements OnDestroy, OnInit {
  sub: Subscription;
  $state: Observable<AppState>;
  searchResults = new Subject<Player[]>();
  isResultsOpen = false;
  searchInProgress = false;

  constructor(
    private store: Store<AppState>,
    private owHeroData: OverwatchHeroDataService,
    private gamerTagService: GamerTagService,
    private hereosService: HereosService,
    private authService: AuthorizationService,
    private newsPostService: NewsService,
    private themeingService: ThemeingService,
    private mdIconRegistry: MdIconRegistry) {

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
    this.themeingService.load();
    this.themeingService.loadTheme(this.themeingService.themes().default);
    this.setDefaultFontSetClass();
    this.authService.setCurrentSession(JSON.parse(window.localStorage.getItem('session')));
    this.newsPostService.getLatestPosts(3);
  }

  setDefaultFontSetClass() {
    this.mdIconRegistry.setDefaultFontSetClass('material-icons');
  }

  onSearch(action) {
    this.store.dispatch(action);
  }

  find(search) {
    this.searchInProgress = true;
    return this.gamerTagService.find(search.tag)
      .do((players) => {
        this.searchInProgress = false;
        this.isResultsOpen = true;
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
