import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../data/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class NoauthGuard implements CanActivate {

  constructor( private usuarioService: UsuarioService,
                private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.usuarioService.validarNoToken()
              .pipe(
                tap( resp => {
                  if (!resp) {

                    this.router.navigateByUrl('/app/dashboards/all/subjects/data-list');

                    //this.router.navigateByUrl('/dashboard');
                  }
                })
              );
  }
}
