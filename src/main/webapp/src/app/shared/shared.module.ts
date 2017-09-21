import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimpleListComponent } from './simple-list/simple-list.component';
import { InputErrorLabelDirective } from './error-label/error-label.directive';

@NgModule({
  declarations: [SimpleListComponent, InputErrorLabelDirective],
  imports: [CommonModule],
  exports: [SimpleListComponent, InputErrorLabelDirective]
})
export class SharedModule {
}
