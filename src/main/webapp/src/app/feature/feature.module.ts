import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';

import { FeatureRoutingModule } from './feature-routing.module';
import { SharedModule } from '../shared/shared.module';

import { FeatureService } from './feature.service';

import { FeatureComponent } from './feature.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MaterializeModule,
    ReactiveFormsModule,
    FeatureRoutingModule,
    SharedModule
  ],
  declarations: [FeatureComponent],
  providers: [FeatureService]
})
export class FeatureModule {
}
