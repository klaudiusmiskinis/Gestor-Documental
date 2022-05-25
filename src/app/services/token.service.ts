import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  public token: string

  constructor() {
    this.initializingToken();
  }

  /**
   * Devuelve el atributo token
   * @returns string
   */
  getToken(): string {
    return this.token;
  }

  /**
   * Devuelve el token del localStorage
   * @returns string
   */
  getSavedToken() {
    if (this.isSaved()) {
      return localStorage.getItem('Bearer');
    } else {
      return '';
    }
  }

  /**
   * Asigna el parametro como nuevo valor al atributo token.
   * @param token string
   */
  setToken(token: string) {
    if (!token) throw 'You need to provide a token';
    if (typeof (token) !== 'string') throw 'Type must be string';
    this.token = token;
  }

  /**
   * Guarda el token en localStorage
   */
  saveToken() {
    localStorage.setItem('Bearer', this.token);
  }

  /**
   * Comprueba si el token esta en localStorage
   * @returns boolean
   */
  isSaved(): boolean {
    if (!localStorage.getItem('Bearer')) return false;
    return true;
  }

  /**
   * Elimina el token del localStorage
   */
  removeToken() {
    localStorage.removeItem('Bearer')
  }

  /**
   * Inicializa el token en caso de que este guardado
   */
  initializingToken() {
    if (this.isSaved()) {
      const tokenSaved: string | any = this.getSavedToken();
      this.setToken(tokenSaved)
    }
  }
}
