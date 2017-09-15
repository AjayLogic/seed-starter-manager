import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureRoutingModule } from './feature-routing.module';

import { FeatureComponent } from './feature.component';

import { FeatureService } from './feature.service';

@NgModule({
  declarations: [FeatureComponent],
  imports: [
    CommonModule,
    FeatureRoutingModule
  ],
  providers: [FeatureService]
})
export class FeatureModule {
}
