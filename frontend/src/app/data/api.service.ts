import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { emailsMatch } from '../containers/form-validations/custom.validators';

// ESQUEMAS PRODUCTOS
export interface IProduct {
  id: number;
  title: string;
  img: string;
  category: string;
  status: string;
  statusColor: string;
  description: string;
  sales: number;
  stock: number;
  date: string;
}

export interface IProductResponse {
  data: IProduct[];
  status: boolean;
  totalItem: number;
  totalPage: number;
  pageSize: string;
  currentPage: string;
}

// ESQUEMAS CURSOS
export interface ISchoolYear {
  uid: number;
  activo: boolean;
  nombre: string;
  nombrecorto: string;
}

export interface ISchoolYearResponse {
  cursos: ISchoolYear[];
  ok: boolean;
  msg: string;
  totalCursos: number;
}

export interface ISingleSchoolYearResponse {
  cursos: ISchoolYear;
  ok: boolean;
  msg: string;
  totalCursos: number;
}

// ESQUEMAS USUARIOS
export interface IUser {
  rol: string;
  uid: number;
  nombre: string;
  apellidos: string;
  email: string;
  curso: ISchoolYear;
}

export interface IUserResponse {
  usuarios: IUser[];
  ok: boolean;
  msg: string;
  totalUsuarios: number;
  // totalPage: number;
  pageSize: string;
  currentPage: string;
}

export interface ISingleUserResponse {
  usuarios: IUser;
  ok: boolean;
  msg: string;
  totalUsuarios: number;
  // totalPage: number;
  pageSize: string;
  currentPage: string;
}

// ESQUEMAS ASIGNATURAS
export interface ISubject {
  uid: number;
  nombre: string;
  nombrecorto: string;
  curso: ISchoolYear;
  profesores: IUser[];
  alumnos: IUser[];
}

export interface ISubjectResponse {
  asignaturas: ISubject[];
  ok: boolean;
  msg: string;
  totalAsignaturas: number;
  // totalPage: number;
  pageSize: string;
  currentPage: string;
}

export interface ISingleSubjectResponse {
  asignaturas: ISubject;
  ok: boolean;
  msg: string;
  totalAsignaturas: number;
  // totalPage: number;
  pageSize: string;
  currentPage: string;
}


@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) { }

  // tslint:disable-next-line:typedef
  getProducts(pageSize: number = 10, currentPage: number = 1, search: string = '', orderBy: string = '') {
    const url = environment.apiUrl + '/cakes/paging';
    let params = new HttpParams();
    params = params.append('pageSize', pageSize + '');
    params = params.append('currentPage', currentPage + '');
    params = params.append('search', search);
    params = params.append('orderBy', orderBy);

    return this.http.get(url, { params })
      .pipe(
        map((res: IProductResponse) => {
          return res;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  // ******* PETICIONES USARIOS *********

  getUsers(pageSize: number, currentPage: number, schoolYear: number) {
    const url = environment.base_url + '/usuarios';
    const token = localStorage.getItem('token');
    let params = new HttpParams();
    params = params.append('pageSize', pageSize + '');
    params = params.append('currentPage', currentPage + '');
    params = params.append('schoolYear', schoolYear + '');
    //console.log(params);
    // params = params.append('search', search);
    // params = params.append('orderBy', orderBy);

    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    //console.log(url);
    //console.log(token);
    return this.http.get(url, { headers, params })
      .pipe(
        map((res: IUserResponse) => {
          return res;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
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
    return this.http.get(url, { headers, params })
      .pipe(
        map((res: ISingleUserResponse) => {
          return res;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  createUser(data: IUser) {

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

  updateUser(data: IUser, id: number) {

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


  // ******* PETICIONES CURSOS *********

  getSchoolYears(pageSize?: number, currentPage?: number, schoolYear?: number) {
    const url = environment.base_url + '/cursos';
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    let params = new HttpParams();
    if(pageSize || currentPage || schoolYear){
      if(pageSize) { params = params.append('pageSize', pageSize + ''); }
      if(currentPage) { params = params.append('currentPage', currentPage + ''); }
      if(schoolYear) { params = params.append('schoolYear', schoolYear + ''); }
    }
    //console.log(url);
    //console.log(token);
    return this.http.get(url, { headers, params })
      .pipe(
        map((res: ISchoolYearResponse) => {
          return res;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  getSchoolYear(id: number) {
    const url = environment.base_url + '/cursos';
    const token = localStorage.getItem('token');
    let params = new HttpParams();
    params = params.append('id', id + '');

    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    //console.log(url);
    //console.log(token);
    return this.http.get(url, { headers, params })
      .pipe(
        map((res: ISingleSchoolYearResponse) => {
          return res;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  dropSchoolYear(uid: number) {
    console.log(uid);
    const url = environment.base_url + '/cursos/' + uid;
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    //console.log(url);
    //console.log(token);
    return this.http.delete(url, { headers });
  }

  createSchoolYear(data: ISchoolYear) {

    const url = environment.base_url + '/cursos';
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    const sendData = {
      "nombre": data['nombre'],
      "nombrecorto": data['nombrecorto'],
      "activo": data['activo']
    }

    return this.http.post(url, sendData, { headers });

  }

  updateSchoolYear(data: ISchoolYear, id: number) {

    const url = environment.base_url + '/cursos/' + id;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    const sendData = {
      "nombre": data['nombre'],
      "nombrecorto": data['nombrecorto'],
      "activo": data['activo']
    }

    return this.http.put(url, sendData, { headers });

  }


  // ******* PETICIONES ASIGNATURAS *********
  getSubjects(pageSize: number, currentPage: number, schoolYear: number) {
    const url = environment.base_url + '/asignaturas';
    const token = localStorage.getItem('token');
    let params = new HttpParams();
    params = params.append('pageSize', pageSize + '');
    params = params.append('currentPage', currentPage + '');
    params = params.append('schoolYear', schoolYear + '');
    //console.log(params);
    // params = params.append('search', search);
    // params = params.append('orderBy', orderBy);

    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    //console.log(url);
    //console.log(token);
    return this.http.get(url, { headers, params })
      .pipe(
        map((res: ISubjectResponse) => {
          return res;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  getSubject(id: number) {
    const url = environment.base_url + '/asignaturas';
    const token = localStorage.getItem('token');
    let params = new HttpParams();
    params = params.append('id', id + '');

    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    //console.log(url);
    //console.log(token);
    return this.http.get(url, { headers, params })
      .pipe(
        map((res: ISingleSubjectResponse) => {
          return res;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  dropSubject(uid: number) {
    console.log(uid);
    const url = environment.base_url + '/asignaturas/' + uid;
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    //console.log(url);
    //console.log(token);
    return this.http.delete(url, { headers });
  }

  createSubject(data: ISubject) {

    const url = environment.base_url + '/asignaturas';
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    const sendData = {
      "nombre": data['nombre'],
      "nombrecorto": data['nombrecorto'],
      "curso": data['curso'],
      "profesores": data['profesores'],
      "alumnos": data['alumnos']
    }

    return this.http.post(url, sendData, { headers });

  }

  updateSubject(data: ISubject, id: number) {

    const url = environment.base_url + '/asignaturas/' + id;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    const sendData = {
      "nombre": data['nombre'],
      "nombrecorto": data['nombrecorto'],
      "curso": data['curso'],
      "profesores": data['profesores'],
      "alumnos": data['alumnos']
    }

    return this.http.put(url, sendData, { headers });

  }

}
