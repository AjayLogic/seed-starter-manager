import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeedVarietyComponent } from './seed-variety.component';

const routes: Routes = [
  { path: 'variety', component: SeedVarietyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeedVarietyRoutingModule {
}
