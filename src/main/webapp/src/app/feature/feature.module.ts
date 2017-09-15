import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureRoutingModule } from './feature-routing.module';

import { FeatureComponent } from './feature.component';

import { FeatureService } from './feature.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [FeatureComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FeatureRoutingModule
  ],
  providers: [FeatureService]
})
export class FeatureModule {
}
