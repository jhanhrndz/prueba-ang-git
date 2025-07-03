import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ejemplo: puedes modificar la request aquí si lo necesitas
    // const cloned = req.clone({ setHeaders: { Authorization: 'Bearer token' } });

    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            // Puedes hacer algo con la respuesta aquí
            console.log('Respuesta recibida:', event);
          }
        },
        error: (error: HttpErrorResponse) => {
          // Manejo global de errores
          console.error('Error en la petición:', error);
        }
      })
    );
  }
}