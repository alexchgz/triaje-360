import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { emailsMatch } from '../containers/form-validations/custom.validators';
import { Curso } from '../models/curso.model';
import { Ejercicio } from '../models/ejercicio.model'
import { environment } from '../../environments/environment';
import { send } from 'process';

@Injectable({ providedIn: 'root' })
export class EjercicioService {
  constructor(private http: HttpClient) { }

  // ******* PETICIONES EJERCICIOS *********

  getExercises(pageSize?: number, currentPage?: number, subject?: number) {
    const url = environment.base_url + '/ejercicios';
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    let params = new HttpParams();
    if(pageSize || currentPage || subject){
      if(pageSize) { params = params.append('pageSize', pageSize + ''); }
      if(currentPage) { params = params.append('currentPage', currentPage + ''); }
      if(subject) { params = params.append('asignatura', subject + ''); }
    }

    // console.log(params);

    return this.http.get(url, { headers, params });

  }

  getExercise(id: number) {
    const url = environment.base_url + '/ejercicios';
    const token = localStorage.getItem('token');
    let params = new HttpParams();
    params = params.append('id', id + '');

    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    return this.http.get(url, { headers, params });

  }

  dropExercise(uid: number) {
    // console.log(uid);
    const url = environment.base_url + '/ejercicios/' + uid;
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    //console.log(url);
    //console.log(token);
    return this.http.delete(url, { headers });
  }

  createExercise(data: Ejercicio) {
    console.log(data);
    const url = environment.base_url + '/ejercicios';
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    const sendData = {
      "nombre": data['nombre'],
      "descripcion": data['descripcion'],
      "desde": data['desde'],
      "hasta": data['hasta'],
      "asignatura": data['asignatura']
    }

    return this.http.post(url, sendData, { headers });

  }

  updateExercise(data: Object, id: number) {
    console.log(data);
    const url = environment.base_url + '/ejercicios/' + id;
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    const sendData = {
      "nombre": data['nombre'],
      "descripcion": data['descripcion'],
      "desde": data['desde'],
      "hasta": data['hasta'],
      "asignatura": data['asignatura']
    }

    // console.log(sendData);

    return this.http.put(url, sendData, { headers });

  }

}
