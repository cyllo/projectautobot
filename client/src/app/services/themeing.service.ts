import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

export interface AppTheme {
  name: string;
  selector: string;
  active?: boolean;
}

export interface AppThemeCatalog {
  [key: string]: AppTheme;
}

@Injectable()
export class ThemeingService {

  // available in themeing.scss
  private _themes: AppThemeCatalog = {
    default:
    {
      name: 'Default',
      selector: 'app-theme-default'
    },
    light:
    {
      name: 'Light',
      selector: 'app-theme-light'
    },
    dark:
    {
      name: 'Dark',
      selector: 'app-theme-dark'
    }
  };

  private currentTheme: AppTheme;

  constructor(private overlayContainer: OverlayContainer) {}

  load() {}

  loadTheme(theme: AppTheme): void {
    this.overlayContainer.themeClass = theme.selector;
    if (!this.currentTheme) {
      this.addTheme(theme);
    } else {
      if (theme.selector === this.currentTheme.selector) {
        return;
      }
      this.removeTheme(this.currentTheme);
      this.addTheme(theme);
    }
  }

  private addTheme(theme: AppTheme): void {
    theme.active = true;
    this.currentTheme = theme;
    const body = document.getElementsByTagName('body')[0];
    body.classList.add(this.currentTheme.selector);
  }

  private removeTheme(theme: AppTheme): void {
    theme.active = false;
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove(theme.selector);
  }

  find(theme: string): AppTheme {
    return this._themes[theme];
  }

  themes(): AppThemeCatalog {
    return Object.freeze(this._themes);
  }

}
