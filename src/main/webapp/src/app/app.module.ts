import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { FeatureModule } from './feature/feature.module';
import { MaterialTypeModule } from './material-type/material-type.module';
import { SeedVarietyModule } from './seed-variety/seed-variety.module';
import { SeedStarterModule } from './seed-starter/seed-starter.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    HomeModule,
    FeatureModule,
    MaterialTypeModule,
    SeedVarietyModule,
    SeedStarterModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
