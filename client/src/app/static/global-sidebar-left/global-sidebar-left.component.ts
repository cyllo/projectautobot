import { Component, OnInit } from '@angular/core';
import { ThemeingService, AppTheme } from '../../services';

@Component({
  selector: 'ow-global-sidebar-left',
  templateUrl: 'global-sidebar-left.component.html',
  styleUrls: [ 'global-sidebar-left.component.scss' ]
})

export class GlobalSideBarLeftComponent implements OnInit {

  sideNavOpen: boolean;
  appThemesCatalog: AppTheme[];

  constructor(private themeingService: ThemeingService) {
    this.sideNavOpen = false;
  }

  ngOnInit() {
    this.appThemesCatalog = Object.values(this.themeingService.themes());
  }

  onSideNavOpenStart(): void {
    this.sideNavOpen = true;
  }

  onSideNavCloseStart(): void {
    this.sideNavOpen = false;
  }

  loadTheme(theme: AppTheme) {
    this.themeingService.loadTheme(theme);
  }

}
