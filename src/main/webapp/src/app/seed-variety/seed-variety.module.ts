import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeedVarietyComponent } from './seed-variety.component';
import { SeedVarietyRoutingModule } from './seed-variety-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SeedVarietyRoutingModule
  ],
  declarations: [SeedVarietyComponent]
})
export class SeedVarietyModule {
}
