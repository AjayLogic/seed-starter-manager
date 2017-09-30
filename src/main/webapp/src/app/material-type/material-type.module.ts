import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialTypeRoutingModule } from './material-type-routing.module';

import { MaterialTypeComponent } from './material-type.component';

import { MaterialTypeService } from './material-type.service';

@NgModule({
  declarations: [MaterialTypeComponent],
  imports: [
    CommonModule,
    MaterialTypeRoutingModule
  ],
  providers: [MaterialTypeService]
})
export class MaterialTypeModule {}
