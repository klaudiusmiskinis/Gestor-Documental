import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  constructor() { }

  @Input() path: string;

  ngOnInit(): void {
    this.path
  }

}
