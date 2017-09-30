import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialTypeRoutingModule } from './material-type-routing.module';
import { SharedModule } from '../shared/shared.module';

import { MaterialTypeComponent } from './material-type.component';

import { MaterialTypeService } from './material-type.service';

@NgModule({
  declarations: [MaterialTypeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialTypeRoutingModule,
    SharedModule
  ],
  providers: [MaterialTypeService]
})
export class MaterialTypeModule {}
