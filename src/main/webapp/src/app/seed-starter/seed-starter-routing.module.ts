import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SeedStarterComponent } from './seed-starter.component';

const routes: Routes = [
  { path: 'seed-starter', component: SeedStarterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeedStarterRoutingModule {
}
