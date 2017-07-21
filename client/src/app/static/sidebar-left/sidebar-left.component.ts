import { Component, OnInit } from '@angular/core';
import { ThemeingService, AppTheme } from '../../services';

@Component({
  selector: 'ow-sidebar-left',
  templateUrl: 'sidebar-left.component.html',
  styleUrls: [ 'sidebar-left.component.scss' ]
})

export class SideBarLeftComponent implements OnInit {

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
