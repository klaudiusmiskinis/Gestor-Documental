import { Component, Input, OnChanges } from '@angular/core';

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

  setupPath(): void{
    this.renderedPath = this.path;
    if (this.renderedPath.charAt(this.renderedPath.length - 1) === '/') {
      this.renderedPath = 'Home';
    } else {
      this.renderedPath = this.renderedPath.split('/?path=')[this.renderedPath.split('/?path=').length - 1];
      this.renderedPath = 'Home ➤ ' + this.renderedPath.split('/').join(' ➤ ');
    }
  }
}
