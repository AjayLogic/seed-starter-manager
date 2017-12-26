import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MasonryModule } from 'angular2-masonry';

import { SharedModule } from '../shared/shared.module';
import { SeedVarietyRoutingModule } from './seed-variety-routing.module';

import { SeedVarietyService } from './seed-variety.service';

import { SeedVarietyComponent } from './seed-variety.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MasonryModule,
    SharedModule,
    SeedVarietyRoutingModule
  ],
  declarations: [SeedVarietyComponent],
  providers: [SeedVarietyService]
})
export class SeedVarietyModule {}
