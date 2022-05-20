import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Actividad } from '../models/actividad.model';

@Injectable({ providedIn: 'root' })
export class ActividadService {
  constructor(private http: HttpClient) { }

  // ******* PETICIONES ACCIONES *********

  getActivities(id: number) {
    const url = environment.base_url + '/actividades';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    let params = new HttpParams();
    if(id) {
        // PARAMS
        params = params.append('id', id + '');
    }

    return this.http.get(url, { headers, params });
      
  }

  createActivity(data: Actividad) {
    const url = environment.base_url + '/actividades';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    const sendData = {
      "nombre": data['nombre'],
      "tiempo": data['tiempo'],
      "momento": data['momento'],
      "ejercicioUsuario": data['ejercicioUsuario']
    }

    return this.http.post(url, sendData, { headers });

  }

}
