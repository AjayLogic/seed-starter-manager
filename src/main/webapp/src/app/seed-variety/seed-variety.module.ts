import { NgModule } from '@angular/core';
import { MasonryModule } from 'angular2-masonry';
import { CommonModule } from '@angular/common';

import { SeedVarietyComponent } from './seed-variety.component';
import { SeedVarietyRoutingModule } from './seed-variety-routing.module';
import { SeedVarietyService } from './seed-variety.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SeedVarietyComponent],
  imports: [
    CommonModule,
    MasonryModule,
    SharedModule,
    SeedVarietyRoutingModule
  ],
  providers: [SeedVarietyService]
})
export class SeedVarietyModule {
}
