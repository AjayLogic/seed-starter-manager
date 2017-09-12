import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeManagerService } from './theme-manager/theme-manager.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ThemeManagerService]
})
export class CoreModule {
}
