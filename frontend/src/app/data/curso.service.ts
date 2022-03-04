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
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CursoService {
  constructor(private http: HttpClient) { }

  // ******* PETICIONES CURSOS *********

  getSchoolYears(pageSize?: number, currentPage?: number, schoolYear?: number, search?: string) {
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
    if(search) {
      // console.log(search);
      params = params.append('texto', search + '');
    }

    return this.http.get(url, { headers, params });
      
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
    return this.http.get(url, { headers, params });
  }

  getSchoolYearActivo() {
    const url = environment.base_url + '/cursos/activo';
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    //console.log(url);
    //console.log(token);
    return this.http.get(url, { headers });
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

  createUpdateSchoolYear(data: Curso, id:any, idDesactivar?: number) {
    console.log(idDesactivar);
    let url;
    
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    let activo = false;

    if(data['activo']) {
      activo = true;
    }

    const sendData = {
      "nombre": data['nombre'],
      "nombrecorto": data['nombrecorto'],
      "activo": activo
    }

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
