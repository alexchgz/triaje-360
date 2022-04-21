import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../shared/auth.service';

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

}
