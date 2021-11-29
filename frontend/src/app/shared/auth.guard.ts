import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UsuarioService } from '../data/usuario.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router, private usuarioService: UsuarioService) {}
  async canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const currentUser = await this.authService.getUser();

    if (currentUser) {
      if (route.data && route.data.roles) {
        if (route.data.roles.includes(currentUser.role)) {
          return true;
        } else {
          this.router.navigate(['/unauthorized']);
          return false;
        }
      } else {
        return true;
      }
    } else {
      this.router.navigate(['/user/login']);
      return false;
    }
  }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const currentUser = await this.authService.getUser();

    if (currentUser) {
      if (route.data && route.data.roles) {
        if (route.data.roles.includes(currentUser.role)) {
          return true;
        } else {
          this.router.navigate(['/unauthorized']);
          return false;
        }
      } else {
        return true;
      }
    } else {
      this.router.navigate(['/user/login']);
      return false;
    }

    // return this.usuarioService.validarToken()
    //           .pipe(
    //             tap( resp => {
    //               // Si devuelve falso, el token no es bueno, salimos a login
    //               if (!resp) {
    //                 this.router.navigateByUrl('/login');
    //               } else {
    //                 // Si la ruta no es para el rol del token, reenviamos a ruta base de rol del token
    //                 if ((next.data.rol !== '*') && (this.usuarioService.rol !== next.data.rol)) {
    //                   switch (this.usuarioService.rol) {
    //                     case 'ROL_ADMIN':
    //                       this.router.navigateByUrl('/admin/dashboard');
    //                       break;
    //                     case 'ROL_ALUMNO':
    //                       this.router.navigateByUrl('/alu/dashboard');
    //                       break;
    //                     case 'ROL_PROFESOR':
    //                       this.router.navigateByUrl('/prof/dashboard');
    //                       break;
    //                   }
    //                }
    //               }
    //             })
    //           );

  }
}
