import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * AuthGuard para protección de rutas administrativas (Semana 08 en adelante).
 * Verifica la presencia de un token JWT válido en sessionStorage o localStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      return true;
    }
    // Redirige al login o a la portada si no está autenticado
    this.router.navigate(['/']);
    return false;
  }
}
