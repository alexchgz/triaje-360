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

export interface ISchoolYear {
  id: number;
  activo: boolean;
  nombre: string;
  nombrecorto: string;
}

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

  getUsers(pageSize: number, currentPage: number) {
    const url = environment.base_url + '/usuarios';
    const token = localStorage.getItem('token');
    let params = new HttpParams();
    params = params.append('pageSize', pageSize + '');
    params = params.append('currentPage', currentPage + '');
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

}
