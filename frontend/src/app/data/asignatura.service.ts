import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { Asignatura } from '../models/asignatura.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AsignaturaService {
  constructor(private http: HttpClient) { }

  // ******* PETICIONES ASIGNATURAS *********
  getSubjects(pageSize?: number, currentPage?: number, schoolYear?: number, userId?:string) {
    const url = environment.base_url + '/asignaturas';
    const token = localStorage.getItem('token');

    // PARAMS
    let params = new HttpParams();
    if(pageSize) { params = params.append('pageSize', pageSize + ''); }
    if(currentPage) { params = params.append('currentPage', currentPage + ''); }
    if(schoolYear) { params = params.append('schoolYear', schoolYear + ''); }
    if(userId) { params = params.append('userId', userId + ''); }

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    
    return this.http.get(url, { headers, params });
  }

  getSubject(id: number, roln?:number, search?:string) {
    const url = environment.base_url + '/asignaturas';
    const token = localStorage.getItem('token');

    // PARAMS
    let params = new HttpParams();
    params = params.append('id', id + '');
    if(roln && search) {
      params = params.append('roln', roln + '');
      params = params.append('texto', search + '');
    }

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    
    return this.http.get(url, { headers, params });
  }

  dropSubject(uid: number) {
    console.log(uid);
    const url = environment.base_url + '/asignaturas/' + uid;
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    
    return this.http.delete(url, { headers });
  }

  createSubject(data: Asignatura) {

    const url = environment.base_url + '/asignaturas';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // DATA
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

  updateSubject(data: Object, id: number, rol?: string, idUsu?: number, accion?: string) {

    const url = environment.base_url + '/asignaturas/' + id;
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS
    let params = new HttpParams();
    if(rol && idUsu && accion) {
      params = params.append('rol', rol);
      params = params.append('idUsu', idUsu + '');
      params = params.append('accion', accion);
    }

    // DATA
    const sendData = {
      "nombre": data['nombre'],
      "nombrecorto": data['nombrecorto'],
      "codigo": data['codigo'],
      "curso": data['curso'],
      "profesores": data['profesores'],
      "alumnos": data['alumnos'],
      "ejercicios": data['ejercicios']
    }

    return this.http.put(url, sendData, { headers, params });

  }

}
