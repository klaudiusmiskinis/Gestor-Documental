/* NG */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { WorkspaceComponent } from './workspace/workspace.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';

/* NG-Material */
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';

/* NG-cdk */
import { DragDropModule } from '@angular/cdk/drag-drop';

/* NGX-Bootstrap */
import { AccordionModule } from 'ngx-bootstrap/accordion';

/* NG-notifier */
import { NotifierModule } from 'angular-notifier';
import { NotifierConfiguration } from './models/notifier.config';

@NgModule({
  declarations: [
    AppComponent,
    WorkspaceComponent,
  ],
  imports: [
    /* NG */
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    /* NG-notifier */
    NotifierModule.withConfig(NotifierConfiguration),

    /* NGX-Bootstrap */
    AccordionModule.forRoot(),

    /* NG-Material */
    MatExpansionModule,
    MatSidenavModule,

    /* NG-cdk */
    DragDropModule

  ],
  providers: [{provide: APP_BASE_HREF, useValue: '/' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
