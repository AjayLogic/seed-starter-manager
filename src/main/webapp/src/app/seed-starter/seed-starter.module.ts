import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterializeModule } from 'angular2-materialize';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { FeatureModule } from '../feature/feature.module';
import { MaterialTypeModule } from '../material-type/material-type.module';
import { SeedVarietyModule } from '../seed-variety/seed-variety.module';
import { SeedStarterRoutingModule } from './seed-starter-routing.module';

import { SeedStarterService } from './seed-starter.service';

import { SeedStarterComponent } from './seed-starter.component';
import { FormComponent } from './form/form.component';

@NgModule({
  imports: [
    CommonModule,
    MaterializeModule,
    ReactiveFormsModule,
    SharedModule,
    FeatureModule,
    MaterialTypeModule,
    SeedVarietyModule,
    SeedStarterRoutingModule
  ],
  declarations: [
    SeedStarterComponent,
    FormComponent
  ],
  providers: [SeedStarterService]
})
export class SeedStarterModule {}
