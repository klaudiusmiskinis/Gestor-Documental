import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInError } from '../config/animations.config';
import { RequestService } from '../services/request.service';
declare var $: any;

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  animations: [fadeInError]
})

export class NavbarComponent implements OnChanges {

  public renderedPath: string;
  public loginForm: FormGroup;

  @Input() path: string;

  constructor(public request: RequestService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[A-zÀ-ú]*$'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ])
    })
  }

  ngOnChanges(): void {
    this.setupPath();
  }

  modal(id: string, state: string): void {
    $('#' + id).modal(state);
  }

  login() {
    const user = {
      username: this.loginForm.controls['username'].value,
      password: this.loginForm.controls['password'].value
    }
    console.log(user);
    
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