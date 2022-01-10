/* NG */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { WorkspaceComponent } from './workspace/workspace.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';

/* Componentes */
import { AppComponent } from './app.component';
import { FoldersComponent } from './folders/folders.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FilesComponent } from './files/files.component';

/* NG-Material */
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';


/* NG-cdk */
import { DragDropModule } from '@angular/cdk/drag-drop';

/* NGX-Bootstrap */
import { AccordionModule } from 'ngx-bootstrap/accordion';

/* NG-notifier */
import { NotifierConfiguration } from './config/notifier.config';
import { NotifierModule } from 'angular-notifier';

@NgModule({
  declarations: [
    AppComponent,
    WorkspaceComponent,
    FoldersComponent,
    FilesComponent,
    NavbarComponent,
    SidebarComponent,
  ],
  imports: [
    /* NG */
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule, 
    FormsModule,
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
