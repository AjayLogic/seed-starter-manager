import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterializeModule } from 'angular2-materialize';

import { SimpleListComponent } from './ui/simple-list/simple-list.component';
import { SimpleDialogComponent } from './ui/simple-dialog/simple-dialog.component';
import { LoadingComponent } from './ui/loading/loading.component';

import { InputErrorLabelDirective } from './error-label/error-label.directive';
import { InputWithValidationDirective } from './directives/input-with-validation/input-with-validation.directive';

@NgModule({
  imports: [
    CommonModule,
    MaterializeModule
  ],
  declarations: [
    SimpleListComponent,
    SimpleDialogComponent,
    LoadingComponent,
    InputErrorLabelDirective,
    InputWithValidationDirective
  ],
  exports: [
    SimpleListComponent,
    SimpleDialogComponent,
    LoadingComponent,
    InputErrorLabelDirective,
    InputWithValidationDirective
  ]
})
export class SharedModule {
}
