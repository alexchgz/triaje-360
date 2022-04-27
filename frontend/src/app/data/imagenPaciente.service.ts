import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ImagenPacienteService {
  constructor(private http: HttpClient) { }

  // ******* PETICIONES IMAGENES PACIENTES *********

  getImagesPaciente(pageSize?: number, currentPage?: number) {
    const url = environment.base_url + '/imagenesPaciente';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS
    let params = new HttpParams();
    if(pageSize) { params = params.append('pageSize', pageSize + ''); }
    if(currentPage) { params = params.append('currentPage', currentPage + ''); }

    return this.http.get(url, { headers, params });
      
  }

  getImagePaciente(id: number) {
    const url = environment.base_url + '/imagenesPaciente';
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
