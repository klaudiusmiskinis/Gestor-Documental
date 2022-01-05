import { Component, Input, OnInit } from '@angular/core';
import { SidebarToggleService } from '../services/sidebar-toggle.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  public sidebarStatus: Boolean;

  constructor(private evtSvc: SidebarToggleService) { 
    this.sidebarStatus = false;
  }

  @Input() path: string;

  ngOnInit(): void {
    this.path
  }

  eventSidebar() {
    this.sidebarStatus = !this.sidebarStatus;
    this.evtSvc.childEventEmitter(this.sidebarStatus)
  }

}
