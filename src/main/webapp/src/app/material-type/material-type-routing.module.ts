import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MaterialTypeComponent } from './material-type.component';

const routes: Routes = [
  { path: 'materials', component: MaterialTypeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialTypeRoutingModule {
}
