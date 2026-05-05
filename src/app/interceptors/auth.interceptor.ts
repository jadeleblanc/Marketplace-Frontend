import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { timeout, catchError, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    timeout(60000),
    catchError(err => {
      if (err.name === 'TimeoutError') {
        return throwError(() => ({ error: { message: 'Le serveur ne répond pas. Vérifiez que le backend est démarré.' } }));
      }
      return throwError(() => err);
    })
  );
};
