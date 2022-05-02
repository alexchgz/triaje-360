import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { Ejercicio } from '../models/ejercicio.model'
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EjercicioService {
  constructor(private http: HttpClient) { }

  // ******* PETICIONES EJERCICIOS *********

  getExercises(pageSize?: number, currentPage?: number, subject?: string, userId?: string) {
    const url = environment.base_url + '/ejercicios';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS
    let params = new HttpParams();
    if(pageSize) { params = params.append('pageSize', pageSize + ''); }
    if(currentPage) { params = params.append('currentPage', currentPage + ''); }
    if(subject) { params = params.append('asignatura', subject + ''); }
    if(userId) { params = params.append('userId', userId + ''); }

    return this.http.get(url, { headers, params });

  }

  getExercise(id: number) {
    const url = environment.base_url + '/ejercicios';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS
    let params = new HttpParams();
    params = params.append('id', id + '');

    return this.http.get(url, { headers, params });

  }

  dropExercise(uid: number) {
    const url = environment.base_url + '/ejercicios/' + uid;
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    
    return this.http.delete(url, { headers });
  }

  createExercise(data: Object) {
    const url = environment.base_url + '/ejercicios';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // DATA
    const sendData = {
      "nombre": data['nombre'],
      "descripcion": data['descripcion'],
      "desde": data['desde'],
      "hasta": data['hasta'],
      "asignatura": data['asignatura'],
      "intentos_limitados": data['intentos_limitados'],
      "max_intentos": data['max_intentos'],
      "imgs": data['imgs']
    }

    console.log('SD:', sendData);

    return this.http.post(url, sendData, { headers });

  }

  updateExercise(data: Object, id: number) {
    const url = environment.base_url + '/ejercicios/' + id;
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    let pacs = [];
    if(data['pacientes'].length > 0) {
      for(let i=0; i<data['pacientes'].length; i++) {
        pacs.push({
          "paciente": data['pacientes'][i].uid
        });
      }
      console.log('pacs:', pacs);
    }

    // DATA
    const sendData = {
      "nombre": data['nombre'],
      "descripcion": data['descripcion'],
      "desde": data['desde'],
      "hasta": data['hasta'],
      "asignatura": data['asignatura'],
      "intentos_limitados": data['intentos_limitados'],
      "max_intentos": data['max_intentos'],
      "imgs": data['imgs'],
      "pacientes": pacs
    }

    console.log('SD:', sendData);

    return this.http.put(url, sendData, { headers });

  }

  // METODO OBTENER ALUMNOS DE LOS EJERCICIOS
  getExerciseStudents(exerciseId: number, pageSize?: number, currentPage?: number, subject?: string, userId?: string, search?: string) {
    const url = environment.base_url + '/ejercicios/alumnos';
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    let params = new HttpParams();
    params = params.append('idEjercicio', exerciseId.toString());
    if(pageSize) { params = params.append('pageSize', pageSize + ''); }
    if(currentPage) { params = params.append('currentPage', currentPage + ''); }
    if(subject) { params = params.append('asignatura', subject + ''); }
    if(userId) { params = params.append('userId', userId + ''); }
    if(search) { params = params.append('texto', search + ''); }

    return this.http.get(url, { headers, params });

  }

}
