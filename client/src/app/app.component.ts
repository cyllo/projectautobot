import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
    private domSanitizer: DomSanitizer,
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
    this.createCustomSVGIconNamespace();

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

  createCustomSVGIconNamespace() {
    const icon_dir = '/img/icons/roles';
    const sanitize = this.domSanitizer.bypassSecurityTrustResourceUrl;
    this.mdIconRegistry.addSvgIcon('role_offense', sanitize(`${icon_dir}/offense.svg`));
    this.mdIconRegistry.addSvgIcon('role_defense', sanitize(`${icon_dir}/defense.svg`));
    this.mdIconRegistry.addSvgIcon('role_support', sanitize(`${icon_dir}/support.svg`));
    this.mdIconRegistry.addSvgIcon('role_tank', sanitize(`${icon_dir}/tank.svg`));
  }

  getHeroes() {
    return this.hereosService.get()
      .subscribe(s => this.store.dispatch({ type: 'GET_HEROES_DATA', payload: s.data.heroes }));
  }
}
