import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccionService {
  constructor(private http: HttpClient) { }

  // ******* PETICIONES ACCIONES *********

  getActions() {
    const url = environment.base_url + '/acciones';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    return this.http.get(url, { headers });
      
  }

  getAction(id: number) {
    const url = environment.base_url + '/acciones';
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
