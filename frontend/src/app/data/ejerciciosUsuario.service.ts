import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EjerciciosUsuarioService {
  constructor(private http: HttpClient) { }

  // ******* PETICIONES EJERCICIOS *********

  getUserExercises(userId?: string, exerciseId?: string, id?: number) {
    const url = environment.base_url + '/ejerciciosUsuario';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS
    let params = new HttpParams();
    if(userId || exerciseId){
      if(userId) { params = params.append('idUsuario', userId + ''); }
      if(exerciseId) { params = params.append('idEjercicio', exerciseId + ''); }
    }
    if(id) {
      params = params.append('id', id + '');
    }

    return this.http.get(url, { headers, params });

  }

  createUserExercise(usuario: string, ejercicio: string) {
    const url = environment.base_url + '/ejerciciosUsuario';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    const sendData = {
      "idUsuario": usuario,
      "idEjercicio": ejercicio
    }

    return this.http.post(url, sendData, { headers });

  }

}
