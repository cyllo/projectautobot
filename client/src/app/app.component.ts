import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { AppState, Player, CurrentSession } from './models';
import { searchGamerTag, addProfiles } from './reducers';
import { MdIconRegistry } from '@angular/material';
import { isNil } from 'ramda';
import * as Cookies from 'js-cookie';

import {
  HereosService,
  GamerTagService,
  OverwatchHeroDataService,
  AuthorizationService,
  ThemeingService,
  UserService
} from './services';

import '../style/app.scss';

@Component({
  selector: 'ow-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [HereosService, AuthorizationService, ThemeingService, UserService]
})
export class AppComponent implements OnDestroy, OnInit {
  sub: Subscription;
  $state: Observable<AppState>;
  searchResults = new Subject<Player[]>();
  isResultsOpen = false;
  searchInProgress = false;
  currentSession: Observable<CurrentSession>;

  constructor(
    private store: Store<AppState>,
    private owHeroData: OverwatchHeroDataService,
    private gamerTagService: GamerTagService,
    private hereosService: HereosService,
    private authService: AuthorizationService,
    private themeingService: ThemeingService,
    private mdIconRegistry: MdIconRegistry,
    private userService: UserService
  ) {

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
    const session = Cookies.get('ow-auth-token');
    if (session) {
      this.authService.refreshAppState(session);
    }

    this.currentSession = this.store.select('currentSession');

    this.themeingService.loadTheme(this.themeingService.themes().default);
    this.setDefaultFontSetClass();

    this.currentSession
    .filter(val => !isNil(val))
    .subscribe(() => {
      this.userService.listFriendRequests();
    });

    this.currentSession
    .filter(val => !isNil(val))
    .subscribe(() => {
      this.userService.listClubs();
    });
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
      .do(gamerTags => {
        // TO DO MAKE SURE EVERY SEARCHED PROFILE IS CACHED IN THE PROFILE STORE
        this.searchInProgress = false;
        this.isResultsOpen = true;
        if (!search.searching) {
          this.store.dispatch(addProfiles(gamerTags));
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
