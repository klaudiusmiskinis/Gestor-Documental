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
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NotifierConfiguration } from './config/notifier.config';
import { NotifierModule } from 'angular-notifier';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { AdminComponent } from './admin/admin.component';
import { LoaderComponent } from './loader/loader.component';
import { AgGridModule } from 'ag-grid-angular';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    WorkspaceComponent,
    FoldersComponent,
    FilesComponent,
    NavbarComponent,
    AdminComponent,
    LoaderComponent,
    ErrorMessageComponent,
    LoginComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AgGridModule.withComponents([]),
    NotifierModule.withConfig(NotifierConfiguration),
    AccordionModule.forRoot(),
    NgxTippyModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
