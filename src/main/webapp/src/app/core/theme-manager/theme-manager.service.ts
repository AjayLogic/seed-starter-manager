import { Injectable } from '@angular/core';
import $ from 'jquery';

import { Theme } from './theme';

@Injectable()
export class ThemeManagerService {

  private readonly localStorageThemeKey = 'theme';

  private themes: Theme[] = [
    { name: 'Dark', location: '/assets/css/dark-theme.css' },
    { name: 'Light', location: '/assets/css/light-theme.css' }
  ];

  constructor() {
    this.restoreTheme();
  }

  getThemes(): string[] {
    return this.themes.map((theme: Theme) => theme.name);
  }

  setTheme(themeName: string): void {
    const theme: Theme = this.themes.find((theme: Theme) => theme.name == themeName);
    if (theme) {
      let themeTag = $('#theme');
      themeTag.attr('href', theme.location);
      themeTag.appendTo('head');
      this.saveThemeOnLocalStorage(themeName);
    } else {
      console.error(`Cannot find the theme '${themeName}'; setting the default theme...`);
      this.setDefaultTheme();
    }
  }

  private setDefaultTheme(): void {
    this.setTheme(this.themes[0].name);
  }

  private restoreTheme(): void {
    if (this.isLocalStorageAvailable()) {
      let themeName = localStorage.getItem(this.localStorageThemeKey);
      if (themeName) {
        this.setTheme(themeName);
      } else {
        this.setDefaultTheme();
      }
    }
  }

  private saveThemeOnLocalStorage(themeName: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.localStorageThemeKey, themeName);
    } else {
      console.error('Cannot store the theme on the local storage');
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      let x = '__storage_test__';
      localStorage.setItem(x, x);
      localStorage.removeItem(x);
      return true;
    }
    catch (e) {
      return false;
    }
  }

}
