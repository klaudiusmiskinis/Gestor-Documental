/* NG */
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { APP_BASE_HREF } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { WorkspaceComponent } from './workspace/workspace.component';
import { HttpClientModule } from '@angular/common/http';
import { NotifierModule, NotifierOptions } from 'angular-notifier';

/* NG-Material */
import { MatExpansionModule } from '@angular/material/expansion';

/* NG-cdk */
import { DragDropModule } from '@angular/cdk/drag-drop';

/* NGX-Bootstrap */
import { AccordionModule } from 'ngx-bootstrap/accordion';

const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'right',
			distance: 12
		},
		vertical: {
			position: 'bottom',
			distance: 32,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

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
    NotifierModule.withConfig(customNotifierOptions),

    /* NGX-Bootstrap */
    AccordionModule.forRoot(),

    /* NG-Material */
    MatExpansionModule,

    /* NG-cdk */
    DragDropModule

  ],
  providers: [{provide: APP_BASE_HREF, useValue: '/' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
