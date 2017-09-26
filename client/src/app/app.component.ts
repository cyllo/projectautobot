import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState, CurrentSession, NavLink } from './models';
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
  navLinks: NavLink[] = [
    {
      name: 'Home',
      routerLink: '',
      routerLinkActive: true,
      iconName: 'home'
    },
    {
      name: 'News',
      routerLink: '/news',
      routerLinkActive: true,
      iconName: 'chrome_reader_mode'
    },
    {
      name: 'Leaderboard',
      routerLink: '/leaderboard',
      routerLinkActive: true,
      iconName: 'view_list'
    },
    {
      name: 'Heroes',
      routerLink: '/heroes',
      routerLinkActive: true,
      iconName: 'games'
    }
  ];

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
    const img_dir = './img';
    const icon_dir = `${img_dir}/icons/roles`;
    const sanitize = this.domSanitizer.bypassSecurityTrustResourceUrl;
    this.mdIconRegistry.addSvgIcon('role_offense', sanitize(`${icon_dir}/offense.svg`))
                       .addSvgIcon('role_defense', sanitize(`${icon_dir}/defense.svg`))
                       .addSvgIcon('role_support', sanitize(`${icon_dir}/support.svg`))
                       .addSvgIcon('role_tank', sanitize(`${icon_dir}/tank.svg`))
                       .addSvgIcon('logo_text', sanitize(`${img_dir}/logo_text.svg`))
                       .addSvgIcon('logo', sanitize(`${img_dir}/logo.svg`));
  }

  getHeroes() {
    return this.hereosService.get()
      .subscribe(s => this.store.dispatch({ type: 'GET_HEROES_DATA', payload: s.data.heroes }));
  }
}
