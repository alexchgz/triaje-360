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
    // const currentToken = this.usuarioService.validarToken();

    // if(!currentToken) {
    //   this.router.navigateByUrl('/user/login');
    // }

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

// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanDeactivate } from '@angular/router';
// import { Observable } from 'rxjs';
// import { UsuarioService } from '../data/usuario.service';
// import { tap } from 'rxjs/operators';
// import { getUserRole } from 'src/app/utils/util';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor( private usuarioService: UsuarioService,
//                private router: Router) {}

//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot) {
//       return this.usuarioService.validarToken()
//               .pipe(
//                 tap( resp => {
//                   // Si devuelve falso, el token no es bueno, salimos a login
//                   if (!resp) {
//                     this.router.navigateByUrl('/login');
//                   } else {
//                     this.router.navigateByUrl('/app/dashboards/all/subjects/data-list');
//                   }
//                 })
//               );
//   }

// }

