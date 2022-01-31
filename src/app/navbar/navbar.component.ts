import { Component, Input } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

  public sidebarStatus: Boolean;

  constructor() {}

  @Input() path: string;
}
