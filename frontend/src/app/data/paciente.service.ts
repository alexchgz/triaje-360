import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../shared/auth.service';
import { Paciente } from '../models/paciente.model';

@Injectable({ providedIn: 'root' })
export class PacienteService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  // ******* PETICIONES PACIENTES *********

  getPatients(ejercicio?: number) {
    const url = environment.base_url + '/pacientes';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS
    let params = new HttpParams();
    if(ejercicio) params = params.append('ejercicio', ejercicio + '');

    return this.http.get(url, { headers, params });

  }

  getPatient(id: number) {
    const url = environment.base_url + '/pacientes';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS
    let params = new HttpParams();
    params = params.append('id', id + '');
    
    return this.http.get(url, { headers, params });
  } 

  createPatient(data: Object, exerciseId: number) {
    const url = environment.base_url + '/pacientes';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    let params = new HttpParams();
    params = params.append('exerciseId', exerciseId + '');

    const sendData = {
      "descripcion": data['descripcion'],
      "camina": data['camina'],
      "color": data['color'],
      "img": data['img'],
      "acciones": data['acciones'],
      "empeora": data['empeora'],
      "tiempoEmpeora": data['tiempoEmpeora']
    }

    return this.http.post(url, sendData, { headers, params });

  }

  updatePatient(data: Object) {
    const url = environment.base_url + '/pacientes/' + data['uid'];
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    const sendData = {
      "descripcion": data['descripcion'],
      "camina": data['camina'],
      "color": data['color'],
      "img": data['img'],
      "acciones": data['acciones'],
      "empeora": data['empeora'],
      "tiempoEmpeora": data['tiempoEmpeora']
    }

    return this.http.put(url, sendData, { headers });

  }

}
