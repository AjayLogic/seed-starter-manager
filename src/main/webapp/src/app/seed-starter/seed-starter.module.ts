import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeedStarterComponent } from './seed-starter.component';
import { SeedStarterService } from './seed-starter.service';
import { SeedStarterRoutingModule } from './seed-starter-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SeedStarterRoutingModule
  ],
  declarations: [SeedStarterComponent],
  providers: [SeedStarterService]
})
export class SeedStarterModule {}
