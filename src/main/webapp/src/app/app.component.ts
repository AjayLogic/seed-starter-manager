import { Component, OnInit } from '@angular/core';

import { ThemeManagerService } from './core/theme-manager/theme-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  themes: string[];

  constructor(private themeManager: ThemeManagerService) {}

  ngOnInit(): void {
    this.themes = this.themeManager.getThemes();
  }

  onThemeSelected(themeName: string): void {
    this.themeManager.setTheme(themeName);
  }

}
