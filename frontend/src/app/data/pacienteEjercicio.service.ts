import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../shared/auth.service';

@Injectable({ providedIn: 'root' })
export class PacienteEjercicioService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  // ******* PETICIONES PACIENTES EJERCICIO *********

  getExercisePatients(ejercicio: number) {
    console.log(ejercicio);
    const url = environment.base_url + '/pacienteEjercicio';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS
    let params = new HttpParams();
    params = params.append('idEjercicio', ejercicio + '');

    return this.http.get(url, { headers, params });

  }

  createExercisePatient(data: Object) {
    const url = environment.base_url + '/pacienteEjercicio';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    const sendData = {
      "idEjercicio": data['idEjercicio'],
      "idPaciente": data['idPaciente'],
      "idImagen": data['idImagen'],
      "x": data['x'],
      "y": data['y']
    }

    console.log(sendData);

    return this.http.post(url, sendData, { headers });

  }

  updateExercisePatient(data: Object) {
    const url = environment.base_url + '/pacienteEjercicio/' + data['uid'];
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    const sendData = {
        "ejercicio": data['ejercicio'],
        "paciente": data['paciente'],
        "imagen": data['imagen'],
        "x": data['x'],
        "y": data['y']
    }

    return this.http.put(url, sendData, { headers });

  }

  dropExercisePatient(uid: number) {
    const url = environment.base_url + '/pacienteEjercicio/' + uid;
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    
    return this.http.delete(url, { headers });
  }

}
