import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  // Rutas públicas que NO necesitan token
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh-token'
  ];

  // No agregar token a las rutas públicas
  const isPublicRoute = publicRoutes.some(route => req.url.includes(route));
  if (isPublicRoute) {
    return next(req);
  }

  // Clonar la petición y agregar el header de autorización
  if (accessToken) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
