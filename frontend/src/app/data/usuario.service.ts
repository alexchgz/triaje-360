import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment';
import { AuthService } from '../shared/auth.service';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private usuario: Usuario;

  constructor(private http: HttpClient, private auth: AuthService) { }

  // ******* PETICIONES USARIOS *********

  getUsers(pageSize?: number, currentPage?: number, role?: string, search?: string, usuariosAsignados?: Usuario[]) {
    const url = environment.base_url + '/usuarios';
    const token = localStorage.getItem('token');
    var idsUsuariosAsignados = [];

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS
    let params = new HttpParams();
    if(pageSize) params = params.append('pageSize', pageSize + '');
    if(currentPage) params = params.append('currentPage', currentPage + '');
    if(role) params = params.append('role', role + '');
    if(search) { params = params.append('texto', search + ''); }

    // si tenemos usuarios asignados -> gestionar asignatura
    if(usuariosAsignados) {
      // pasamos a la peticion solo los ids, no los usuarios enteros
      for(let i=0; i<usuariosAsignados.length; i++) {
        idsUsuariosAsignados.push(usuariosAsignados[i].uid);
      }
      params = params.append('idsUsuAsignados', idsUsuariosAsignados.join(', '));
    }

    return this.http.get(url, { headers, params });

  }

  getUser(id: number) {
    const url = environment.base_url + '/usuarios';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS
    let params = new HttpParams();
    params = params.append('id', id + '');
    
    return this.http.get(url, { headers, params });
  }

  createUser(data: Usuario) {
    const url = environment.base_url + '/usuarios';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    const sendData = {
      "nombre": data['nombre'],
      "apellidos": data['apellidos'],
      "email": data['email'],
      "password": data['password'],
      "rol": data['rol'],
      "curso": data['curso'],
      "activo": data['activo']
    }

    return this.http.post(url, sendData, { headers });

  }

  updateUser(data: Usuario, id: number) {
    const url = environment.base_url + '/usuarios/' + id;
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    const sendData = {
      "nombre": data['nombre'],
      "apellidos": data['apellidos'],
      "email": data['email'],
      "password": data['password'],
      "rol": data['rol'],
      "activo": data['activo']
    }

    return this.http.put(url, sendData, { headers });

  }

  dropUser(uid: number) {
    const url = environment.base_url + '/usuarios/' + uid;
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    
    return this.http.delete(url, { headers });
  }

  // validar los tokens
  validar(correcto: boolean, incorrecto: boolean): Observable<boolean> {

    if (this.token === '') {
      this.limpiarLocalStore();
      return of(incorrecto);
    }

    return this.http.get(`${environment.base_url}/login/token`, this.cabeceras)
      .pipe(
        tap( (res: any) => {
          // extaemos los datos que nos ha devuelto y los guardamos en el usurio y en localstore
          const { uid, nombre, apellidos, email, rol, alta, activo, token} = res;
          localStorage.setItem('token', token);
          
          // Definimos las variables del servicio
            // ID
          this.auth.uid = uid;
            // ROL
          switch (rol) {
            case 'ROL_ADMIN':
              this.auth.rol = 0;
              break;
            case 'ROL_PROFESOR':
              this.auth.rol = 1;
              break;
            case 'ROL_ALUMNO':
              this.auth.rol = 2;
              break;
            default:
              break;
          }
            // TOKEN
          this.auth.token = token;

          this.usuario = new Usuario(uid, rol, nombre, apellidos, email, alta, activo);
        }),
        map ( res => {
          return correcto;
        }),
        catchError ( err => {
          this.limpiarLocalStore();
          return of(incorrecto);
        })
      );
  }

  validarToken(): Observable<boolean> {
    return this.validar(true, false);
  }

  validarNoToken(): Observable<boolean> {
    return this.validar(false, true);
  }

  // auxiliares token
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  limpiarLocalStore(): void{
    localStorage.removeItem('token');
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }};
  }

}
