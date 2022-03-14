import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { Curso } from '../models/curso.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CursoService {
  constructor(private http: HttpClient) { }

  // ******* PETICIONES CURSOS *********

  getSchoolYears(pageSize?: number, currentPage?: number, schoolYear?: number, search?: string) {
    const url = environment.base_url + '/cursos';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS
    let params = new HttpParams();
    if(pageSize) { params = params.append('pageSize', pageSize + ''); }
    if(currentPage) { params = params.append('currentPage', currentPage + ''); }
    if(schoolYear) { params = params.append('schoolYear', schoolYear + ''); }
    if(search) { params = params.append('texto', search + ''); }

    return this.http.get(url, { headers, params });
      
  }

  getSchoolYear(id: number) {
    const url = environment.base_url + '/cursos';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS
    let params = new HttpParams();
    params = params.append('id', id + '');
    
    return this.http.get(url, { headers, params });
  }

  getSchoolYearActivo() {
    const url = environment.base_url + '/cursos/activo';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    
    return this.http.get(url, { headers });
  }

  dropSchoolYear(uid: number) {
    const url = environment.base_url + '/cursos/' + uid;
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    
    return this.http.delete(url, { headers });
  }

  createUpdateSchoolYear(data: Curso, id:any, idDesactivar?: number) {
    let url;
    const token = localStorage.getItem('token');

    let activo = false;
    if(data['activo']) {
      activo = true;
    }

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // DATA
    const sendData = {
      "nombre": data['nombre'],
      "nombrecorto": data['nombrecorto'],
      "activo": activo
    }

    // PARAMS
    let params = new HttpParams();
    if(idDesactivar) {
      params = params.append('idDesactivar', idDesactivar + '');
    }
    
    if(id != '') {
      url = environment.base_url + '/cursos/' + id;
      return this.http.put(url, sendData, { headers, params });
    } else {
      url = environment.base_url + '/cursos';
      return this.http.post(url, sendData, { headers, params });
    }

  }

}
