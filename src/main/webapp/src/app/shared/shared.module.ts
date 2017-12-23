import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimpleListComponent } from './simple-list/simple-list.component';
import { InputErrorLabelDirective } from './error-label/error-label.directive';
import { SimpleDialogComponent } from './simple-dialog/simple-dialog.component';
import { MaterializeModule } from 'angular2-materialize';
import { InputWithValidationDirective } from './directives/input-with-validation/input-with-validation.directive';
import { LoadingComponent } from './ui/loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    MaterializeModule
  ],
  declarations: [
    SimpleListComponent,
    InputErrorLabelDirective,
    SimpleDialogComponent,
    InputWithValidationDirective,
    LoadingComponent
  ],
  exports: [
    SimpleListComponent,
    InputErrorLabelDirective,
    SimpleDialogComponent,
    InputWithValidationDirective,
    LoadingComponent
  ]
})
export class SharedModule {
}
