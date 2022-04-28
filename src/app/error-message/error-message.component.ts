import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fadeInError } from '../config/animations.config';

@Component({
  selector: 'error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css'],
  animations: [fadeInError]
})
export class ErrorMessageComponent implements OnInit {

  @Input() ctrl: FormControl | any;

  ERROR_MESSAGE = {
    required: () => `El campo es obligatorio.`,
    minlength: (par) => `Mínimo ${par.requiredLength} caracteres.`,
    maxlength: (par) => `Máximo ${par.requiredLength} caracteres.`,
    pattern: () => `No se permiten cáracteres especiales.`,
    nameExists: () => `Este nombre ya existe.`,
    invalidNumber: () => `Debes introducir un número válido.`
  };

  constructor() { }

  ngOnInit(): void {
  }

  shouldShowErrors(): boolean {
    return this.ctrl && this.ctrl.errors;
  }

  listOfErrors(): string[] {
    return Object.keys(this.ctrl.errors).map(
      err => this.ERROR_MESSAGE[err](this.ctrl.getError(err))
    );
  }

}
