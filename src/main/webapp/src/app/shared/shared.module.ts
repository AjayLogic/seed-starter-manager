import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimpleListComponent } from './simple-list/simple-list.component';
import { InputErrorLabelDirective } from './error-label/error-label.directive';
import { SimpleDialogComponent } from './simple-dialog/simple-dialog.component';
import { MaterializeModule } from 'angular2-materialize';

@NgModule({
  declarations: [SimpleListComponent, InputErrorLabelDirective, SimpleDialogComponent],
  imports: [CommonModule, MaterializeModule],
  exports: [SimpleListComponent, InputErrorLabelDirective, SimpleDialogComponent]
})
export class SharedModule {
}
