import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fadeInError } from '../config/animations.config';

@Component({
  selector: 'error-message',
  templateUrl: './error-message.component.html',
  animations: [fadeInError]
})
export class ErrorMessageComponent {

  @Input() ctrl: FormControl | any;
  @Input() isTouched: boolean = false;

  ERROR_MESSAGE = {
    required: () => `El campo es obligatorio.`,
    minlength: (par) => `Mínimo ${par.requiredLength} caracteres.`,
    maxlength: (par) => `Máximo ${par.requiredLength} caracteres.`,
    pattern: () => `No se permiten cáracteres especiales.`,
    nameExists: () => `Este nombre ya existe.`,
    invalidNumber: () => `Debes introducir un número válido.`,
    preOld: () => `Fecha demasiado antigua.`,
    postToday: () => `Fecha futura.`,
    hasExtension: () => `No hace falta escribir la extensión.`,
    lastSlash: () => `La última letra tiene que ser /.`,
    max: (par) => `El valor máximo es ${par.max}.`,
    min: (par) => `El valor mínimo es ${par.min}.`
  };

  /**
   * Comprueba si al atributo para mostrar los errores es valido dependiendo del click al campo
   * @returns boolean
   */
  shouldShowErrors(): boolean {
    if (!this.isTouched) return this.ctrl && this.ctrl.errors;
    return this.ctrl && this.ctrl.errors && this.ctrl.touched;
  }

  /**
   * Recorriendo los errores y mostrando los mensajes.
   * @returns string[]
   */
  listOfErrors(): string[] {
    return Object.keys(this.ctrl.errors).map(
      err => this.ERROR_MESSAGE[err](this.ctrl.getError(err))
    );
  }
}
