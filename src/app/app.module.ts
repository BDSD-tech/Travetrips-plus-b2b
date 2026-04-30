import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TtsInterceptor, ErrorInterceptor } from './_helpers';
import { DatePipe, DecimalPipe } from '@angular/common';

import { DefaultModule } from './layouts/default/default.module';
import { LoginModule } from './layouts/login/login.module';
import { DashboardModule } from './layouts/dashboard/dashboard.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    DefaultModule,
    LoginModule,
    DashboardModule
  ],
  providers: [
    DatePipe,DecimalPipe,
    { provide: HTTP_INTERCEPTORS, useClass: TtsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
