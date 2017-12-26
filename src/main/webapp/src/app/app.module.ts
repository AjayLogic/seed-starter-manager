import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { SeedStarterModule } from './seed-starter/seed-starter.module';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    HomeModule,
    SeedStarterModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
