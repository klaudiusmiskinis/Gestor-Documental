import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {

  constructor(private token: TokenService) { }

  /**
   * Intercepta las peticiones antes de enviarlas y añade el header Authorization 
   * en caso de que el token este guardado en localStorage
   * @param request 
   * @param next 
   * @returns 
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.token.isSaved()) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + this.token.getSavedToken()
        }
      })
    }
    return next.handle(request);
  }
}
