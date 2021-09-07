import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { emailsMatch } from '../containers/form-validations/custom.validators';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private usuario: Usuario;

  constructor(private http: HttpClient) { }

  // ******* PETICIONES USARIOS *********

  getUsers(pageSize?: number, currentPage?: number, schoolYear?: number) {
    const url = environment.base_url + '/usuarios';
    const token = localStorage.getItem('token');
    let params = new HttpParams();
    if(pageSize || currentPage || schoolYear){
      if(pageSize) params = params.append('pageSize', pageSize + '');
      if(currentPage) params = params.append('currentPage', currentPage + '');
      if(schoolYear) params = params.append('schoolYear', schoolYear + '');
    }
    //console.log(params);
    // params = params.append('search', search);
    // params = params.append('orderBy', orderBy);

    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    //console.log(url);
    //console.log(token);
    return this.http.get(url, { headers, params });
      // .pipe(
      //   map((res: IUserResponse) => {
      //     return res;
      //   }),
      //   catchError(errorRes => {
      //     return throwError(errorRes);
      //   })
      // );
  }

  getUser(id: number) {
    const url = environment.base_url + '/usuarios';
    const token = localStorage.getItem('token');
    let params = new HttpParams();
    params = params.append('id', id + '');

    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    //console.log(url);
    //console.log(token);
    return this.http.get(url, { headers, params });
      // .pipe(
      //   map((res: ISingleUserResponse) => {
      //     return res;
      //   }),
      //   catchError(errorRes => {
      //     return throwError(errorRes);
      //   })
      // );
  }

  createUser(data: Usuario) {

    const url = environment.base_url + '/usuarios';
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    const sendData = {
      "nombre": data['nombre'],
      "apellidos": data['apellidos'],
      "email": data['email'],
      "password": data['password'],
      "rol": data['rol'],
      "curso": data['curso']
    }

    return this.http.post(url, sendData, { headers });

  }

  updateUser(data: Usuario, id: number) {

    const url = environment.base_url + '/usuarios/' + id;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    const sendData = {
      "nombre": data['nombre'],
      "apellidos": data['apellidos'],
      "email": data['email'],
      "password": data['password'],
      "rol": data['rol'],
      "curso": data['curso'].uid
    }

    return this.http.put(url, sendData, { headers });

  }

  dropUser(uid: number) {
    console.log(uid);
    const url = environment.base_url + '/usuarios/' + uid;
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    //console.log(url);
    //console.log(token);
    return this.http.delete(url, { headers });
  }
}
