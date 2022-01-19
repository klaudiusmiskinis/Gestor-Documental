import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  public sidebarStatus: Boolean;

  constructor() { 
    this.sidebarStatus = false;
  }

  @Input() path: string;

  ngOnInit(): void {
  }

}
