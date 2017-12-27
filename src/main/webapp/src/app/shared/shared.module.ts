import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterializeModule } from 'angular2-materialize';

import { ToastService } from './ui/toast-service/toast.service';

import { SimpleListComponent } from './ui/simple-list/simple-list.component';
import { SimpleDialogComponent } from './ui/simple-dialog/simple-dialog.component';
import { LoadingComponent } from './ui/loading/loading.component';

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
    InputWithValidationDirective
  ],
  exports: [
    SimpleListComponent,
    SimpleDialogComponent,
    LoadingComponent,
    InputWithValidationDirective
  ],
  providers: [ToastService]
})
export class SharedModule {
}
