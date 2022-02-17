/* NG */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { WorkspaceComponent } from './workspace/workspace.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FoldersComponent } from './folders/folders.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FilesComponent } from './files/files.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NotifierConfiguration } from './config/notifier.config';
import { NotifierModule } from 'angular-notifier';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    WorkspaceComponent,
    FoldersComponent,
    FilesComponent,
    NavbarComponent,
    AdminComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule, 
    FormsModule,
    NotifierModule.withConfig(NotifierConfiguration),
    AccordionModule.forRoot(),
    MatExpansionModule,
    MatSidenavModule,
    NgxTippyModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/' }, 
    HttpClientModule
],
  bootstrap: [AppComponent]
})
export class AppModule { }
