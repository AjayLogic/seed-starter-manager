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
      $('#theme').attr('href', theme.location);
      this.saveThemeOnLocalStorage(themeName);
    } else {
      console.error(`Cannot find the theme '${themeName}'; setting the default theme...`);
      this.setTheme(this.themes[0].name);
    }
  }

  private restoreTheme() {
    if (this.isLocalStorageAvailable()) {
      let themeName = localStorage.getItem(this.localStorageThemeKey);
      this.setTheme(themeName);
    }
  }

  private saveThemeOnLocalStorage(themeName: string) {
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
