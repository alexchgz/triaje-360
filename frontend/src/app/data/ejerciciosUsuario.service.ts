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
import { Ejercicio } from '../models/ejercicio.model'
import { EjerciciosUsuario } from '../models/ejerciciosUsuario.model';
import { environment } from '../../environments/environment';
import { send } from 'process';

@Injectable({ providedIn: 'root' })
export class EjerciciosUsuarioService {
  constructor(private http: HttpClient) { }

  // ******* PETICIONES EJERCICIOS *********

  getUserExercises(userId?: string, exerciseId?: string) {
    const url = environment.base_url + '/ejerciciosUsuario';
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    let params = new HttpParams();
    if(userId || exerciseId){
      if(userId) { params = params.append('idUsuario', userId + ''); }
      if(exerciseId) { params = params.append('idEjercicio', exerciseId + ''); }
    }

    // console.log(params);

    return this.http.get(url, { headers, params });

  }

  createUserExercise(usuario: string, ejercicio: string) {

    const url = environment.base_url + '/ejerciciosUsuario';
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    const sendData = {
      "idUsuario": usuario,
      "idEjercicio": ejercicio
    }

    console.log(sendData);

    return this.http.post(url, sendData, { headers });

  }

}
