import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeedStarterComponent } from './seed-starter.component';
import { SeedStarterService } from './seed-starter.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SeedStarterComponent],
  providers: [SeedStarterService]
})
export class SeedStarterModule {}
