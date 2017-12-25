import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SeedStarterComponent } from './seed-starter.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  { path: 'seed-starter', component: SeedStarterComponent },
  { path: 'seed-starter/new', component: FormComponent },
  { path: 'seed-starter/:id/edit', component: FormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeedStarterRoutingModule {
}
