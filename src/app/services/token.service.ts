import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  public token: string

  constructor() {
    this.initializingToken();
    console.log(this.getToken())
  }

  getToken() {
    return this.token;
  }

  getSavedToken() {
    if (this.isSaved()) {
      return localStorage.getItem('Bearer');
    } else {
      return '';
    }
  }

  setToken(token) {
    if (!token) throw 'You need to provide a token';
    if (typeof (token) !== 'string') throw 'Type must be string';
    this.token = token;
  }

  saveToken() {
    localStorage.setItem('Bearer', this.token);
  }

  isSaved() {
    if (!localStorage.getItem('Bearer')) return false;
    return true;
  }

  removeToken() {
    localStorage.removeItem('Bearer')
  }

  initializingToken() {
    if (this.isSaved()) {
      const tokenSaved = this.getSavedToken();
      this.setToken(tokenSaved)
    }
  }
}
