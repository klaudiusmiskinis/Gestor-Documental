import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidebarToggleService } from '../services/sidebar-toggle.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  showFiller = false;

  @ViewChild('drawer') drawer: MatSidenav;

  constructor(private sidebarService: SidebarToggleService) { }

  ngOnInit(): void {
    this.sidebarService.parentListenerEvent().subscribe(info => {
      if(this.drawer) {
        this.drawer.toggle();
      }
    })
  }

}
