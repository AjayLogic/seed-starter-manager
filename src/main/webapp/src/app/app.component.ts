import { Component, OnInit } from '@angular/core';

import { ThemeManagerService } from './core/theme-manager/theme-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private themes: string[];

  constructor(private themeManager: ThemeManagerService) {}

  ngOnInit(): void {
    this.themes = this.themeManager.getThemes();
  }

  private onThemeSelected(themeName: string): void {
    this.themeManager.setTheme(themeName);
  }

}
