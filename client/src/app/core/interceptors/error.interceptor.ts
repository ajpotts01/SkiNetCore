import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}

  // Course writes this manually because generators didn't exist yet
  // But they use any instead of unknown as the generic - is this required?
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          if (error.status === 400) {
            // lol
            if (error.error.errors) {
              throw error.error;
            } else {
              this.toastr.error(error.error.message, error.error.statusCode);
            }
          }
          else if (error.status === 401) {
            this.toastr.error(error.error.message, error.error.statusCode);
          }          
          else if (error.status === 404) {
            this.router.navigateByUrl('/not-found');
          }
          else if (error.status === 500) {
            const navigationExtras: NavigationExtras = {
              state: {
                // lmao
                error: error.error
              }
            };
            this.router.navigateByUrl('/server-error', navigationExtras);
          }
        }

        return throwError(() => new Error(error));
      })
    );
  }
}
