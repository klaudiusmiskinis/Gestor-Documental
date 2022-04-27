import { Component, Input, OnChanges } from '@angular/core';
declare var $: any;

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html'
})

export class NavbarComponent implements OnChanges {

  public renderedPath: string;

  @Input() path: string;

  ngOnChanges(): void {
    this.setupPath();
  }

  modal(id: string, state: string): void {
    $('#' + id).modal(state);
  }

  setupPath(): void {
    this.renderedPath = this.path;
    if (this.renderedPath.charAt(this.renderedPath.length - 1) === '/') {
      this.renderedPath = 'Gestor documental';
    } else {
      this.renderedPath = this.renderedPath.split('/?path=')[this.renderedPath.split('/?path=').length - 1];
      this.renderedPath = 'Gestor documental > ' + this.renderedPath.split('/').join(' > ');
    }
  }
}