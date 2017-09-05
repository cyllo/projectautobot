import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState, CurrentSession } from './models';
import { MdIconRegistry } from '@angular/material';
import { isNil } from 'ramda';
import * as Cookies from 'js-cookie';

import {
  HereosService,
  OverwatchHeroDataService,
  AuthorizationService,
  ThemeingService,
  UserService,
  FriendShipService
} from './services';

import '../style/app.scss';

@Component({
  selector: 'ow-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [HereosService, AuthorizationService, ThemeingService, UserService, FriendShipService]
})
export class AppComponent implements OnInit {
  $state: Observable<AppState>;
  currentSession: Observable<CurrentSession>;

  constructor(
    private store: Store<AppState>,
    private owHeroData: OverwatchHeroDataService,
    private hereosService: HereosService,
    private authService: AuthorizationService,
    private themeingService: ThemeingService,
    private mdIconRegistry: MdIconRegistry,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.$state = this.store.select(s => s);

    this.getHeroes();

    this.owHeroData.load();

    const session = Cookies.get('ow-auth-token');
    if (session) {
      this.authService.refreshAppState(session);
    }

    this.currentSession = this.store.select('currentSession').skipWhile(isNil);

    this.themeingService.loadTheme(this.themeingService.themes().default);
    this.setDefaultFontSetClass();

    this.currentSession
    .filter(val => !isNil(val))
    .subscribe(() => {
      this.userService.listFriendRequests();
      this.userService.listClubs();
    });
  }

  setDefaultFontSetClass() {
    this.mdIconRegistry.setDefaultFontSetClass('material-icons');
  }

  getHeroes() {
    return this.hereosService.get()
      .subscribe(s => this.store.dispatch({ type: 'GET_HEROES_DATA', payload: s.data.heroes }));
  }
}
