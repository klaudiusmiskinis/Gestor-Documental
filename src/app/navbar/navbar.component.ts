import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
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
  @Output() isAdminEmitter: any = new EventEmitter();
  @Input() path: string;
  public isAdmin: boolean;
  public renderedPath: string;
  public loginForm: FormGroup;

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
    this.getAdmin();
  }

  ngOnChanges(): void {
    this.setupPath();
  }

  emitAdmin() {
    this.isAdminEmitter.emit(this.isAdmin);
  }

  async getAdmin() {
    const response = await this.request.isAuthenticated();
    this.isAdmin = response.isAuthenticated
    this.emitAdmin();
  }

  modal(id: string, state: string): void {
    $('#' + id).modal(state);
  }

  async login() {
    const user = {
      username: this.loginForm.controls['username'].value,
      password: this.loginForm.controls['password'].value
    }
    const res = await this.request.login(user)
    if (res) {
      this.isAdmin = true;
      this.emitAdmin();
      this.modal('login', 'hide')
    } else {
      this.loginForm.reset();
    }
  }

  logout() {
    this.isAdmin = false;
    this.emitAdmin();
    this.request.logout();
    this.request.redirectTo('gestor-documental')
    this.modal('logout', 'hide')
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