import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { emailsMatch } from '../containers/form-validations/custom.validators';
import { Asignatura } from '../models/asignatura.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AsignaturaService {
  constructor(private http: HttpClient) { }

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
    return this.http.get(url, { headers, params });
      // .pipe(
      //   map((res: ISubjectResponse) => {
      //     return res;
      //   }),
      //   catchError(errorRes => {
      //     return throwError(errorRes);
      //   })
      // );
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
    return this.http.get(url, { headers, params });
      // .pipe(
      //   map((res: ISingleSubjectResponse) => {
      //     return res;
      //   }),
      //   catchError(errorRes => {
      //     return throwError(errorRes);
      //   })
      // );
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

  createSubject(data: Asignatura) {

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

  updateSubject(data: Asignatura, id: number) {

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
