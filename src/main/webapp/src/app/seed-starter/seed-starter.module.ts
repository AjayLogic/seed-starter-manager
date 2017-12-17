import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeedStarterComponent } from './seed-starter.component';
import { SeedStarterService } from './seed-starter.service';
import { SeedStarterRoutingModule } from './seed-starter-routing.module';
import { FormComponent } from './form/form.component';

@NgModule({
  imports: [
    CommonModule,
    SeedStarterRoutingModule
  ],
  declarations: [
    SeedStarterComponent,
    FormComponent
  ],
  providers: [SeedStarterService]
})
export class SeedStarterModule {}
