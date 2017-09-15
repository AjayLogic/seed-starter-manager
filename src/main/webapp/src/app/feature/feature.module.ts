import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FeatureRoutingModule } from './feature-routing.module';
import { SharedModule } from '../shared/shared.module';

import { FeatureComponent } from './feature.component';

import { FeatureService } from './feature.service';

@NgModule({
  declarations: [FeatureComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FeatureRoutingModule,
    SharedModule
  ],
  providers: [FeatureService]
})
export class FeatureModule {
}
