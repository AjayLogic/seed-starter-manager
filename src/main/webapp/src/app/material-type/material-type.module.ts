import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialTypeRoutingModule } from './material-type-routing.module';
import { SharedModule } from '../shared/shared.module';

import { MaterialTypeService } from './material-type.service';

import { MaterialTypeComponent } from './material-type.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialTypeRoutingModule,
    SharedModule
  ],
  declarations: [MaterialTypeComponent],
  providers: [MaterialTypeService]
})
export class MaterialTypeModule {}
