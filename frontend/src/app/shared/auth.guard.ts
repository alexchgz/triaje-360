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
    
    if(currentUser.uid === undefined && state.url!='/user/login') {
      // console.log(currentUser);
      // console.log('A LOGIN');
      this.router.navigateByUrl('/user/login');
      return false;
    }

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
    // const currentToken = this.usuarioService.validarToken();

    if(currentUser.uid === undefined && state.url!='/user/login') {
      // console.log(currentUser);
      // console.log('A LOGIN');
      this.router.navigateByUrl('/user/login');
      return false;
    }

    if (currentUser) {
      // console.log(currentUser);
      if (route.data && route.data.roles) {
        if (route.data.roles.includes(currentUser.role)) {
          return true;
        } else {
          console.log('entro');
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
}

