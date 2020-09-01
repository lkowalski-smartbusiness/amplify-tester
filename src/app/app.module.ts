import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {RouterModule} from '@angular/router';
import {AmplifyUIAngularModule} from '@aws-amplify/ui-angular';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from './app-routing.module';
import { OtherPageComponent } from './other-page/other-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OtherPageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AmplifyUIAngularModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
