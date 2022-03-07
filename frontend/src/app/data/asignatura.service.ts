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
import data from './cakes';

@Injectable({ providedIn: 'root' })
export class AsignaturaService {
  constructor(private http: HttpClient) { }

  // ******* PETICIONES ASIGNATURAS *********
  getSubjects(pageSize?: number, currentPage?: number, schoolYear?: number, userId?:string) {
    const url = environment.base_url + '/asignaturas';
    const token = localStorage.getItem('token');

    let params = new HttpParams();
    if(pageSize || currentPage || schoolYear || userId){
      if(pageSize) { params = params.append('pageSize', pageSize + ''); }
      if(currentPage) { params = params.append('currentPage', currentPage + ''); }
      if(schoolYear) { params = params.append('schoolYear', schoolYear + ''); }
      if(userId) { params = params.append('userId', userId + ''); }
    }
    // console.log(params);
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

  getSubject(id: number, search?:string) {
    const url = environment.base_url + '/asignaturas';
    const token = localStorage.getItem('token');
    let params = new HttpParams();
    params = params.append('id', id + '');
    if(search) {
      params = params.append('texto', search + '');
    }

    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    
    return this.http.get(url, { headers, params });
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
      "codigo": data['codigo'],
      "curso": data['curso'],
      "profesores": data['profesores'],
      "alumnos": data['alumnos'],
      "ejercicios": data['ejercicios']
    }

    return this.http.post(url, sendData, { headers });

  }

  updateSubject(data: Object, id: number) {

    const url = environment.base_url + '/asignaturas/' + id;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // console.log(data['profesores']);
    for(let i=0; i<data['profesores'].length; i++){
      // console.log(data['profesores'][i]['usuario']['uid']);
      if(data['profesores'][i]['usuario']['uid'])
        data['profesores'][i]['usuario'] = data['profesores'][i]['usuario']['uid'];

        // console.log(data['profesores'][i]);
    }

    for(let j=0; j<data['alumnos'].length; j++){
      // console.log(data['profesores'][i]['usuario']['uid']);
      if(data['alumnos'][j]['usuario']['uid'])
        data['alumnos'][j]['usuario'] = data['alumnos'][j]['usuario']['uid'];

        // console.log(data['profesores'][i]);
    }

    // console.log(data['ejercicios']);
    for(let k=0; k<data['ejercicios'].length; k++){
      // console.log(data['profesores'][i]['usuario']['uid']);
      // console.log(data['ejercicios'][k]);
      if(data['ejercicios'][k]['ejercicio']['uid']) {
        data['ejercicios'][k]['ejercicio'] = data['ejercicios'][k]['ejercicio']['uid'];
      }
        // console.log(data['profesores'][i]);
    }
    // console.log(data['ejercicios']);

    const sendData = {
      "nombre": data['nombre'],
      "nombrecorto": data['nombrecorto'],
      "codigo": data['codigo'],
      "curso": data['curso'],
      "profesores": data['profesores'],
      "alumnos": data['alumnos'],
      "ejercicios": data['ejercicios']
    }

    // console.log(sendData);

    return this.http.put(url, sendData, { headers });

  }

}
