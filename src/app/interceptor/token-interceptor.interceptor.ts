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
