import { Component, OnInit } from '@angular/core';
import { ThemeingService, AppTheme } from '../../services';
import { AppState } from '../../models';
import { isNil } from 'ramda';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ow-sidebar-left',
  templateUrl: 'sidebar-left.component.html',
  styleUrls: [ 'sidebar-left.component.scss' ],
  providers: [ThemeingService]
})

export class SideBarLeftComponent implements OnInit {

  sideNavOpen: boolean;
  appThemesCatalog: AppTheme[];

  userLoggedIn: Observable<boolean>;

  constructor(private store: Store<AppState>,
    private themeingService: ThemeingService) {
    this.sideNavOpen = false;
  }

  ngOnInit() {
    this.appThemesCatalog = Object.values(this.themeingService.themes());
    this.userLoggedIn = this.store.select('currentSession')
      .map(currentSession => !isNil(currentSession));
  }

  loadTheme(theme: AppTheme) {
    this.themeingService.loadTheme(theme);
  }

}
