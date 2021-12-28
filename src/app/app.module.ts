import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PosicionComponent } from './posicion/posicion.component';

@NgModule({
  declarations: [
    AppComponent,
    WorkspaceComponent,
    PosicionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BreadcrumbModule,
    PanelMenuModule,
    ButtonModule,
    InputTextModule,
    AppRoutingModule,
    HttpClientModule,
    CardModule
  ],
  providers: [{provide: APP_BASE_HREF, useValue: '/' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
