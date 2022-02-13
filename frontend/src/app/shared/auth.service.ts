import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from } from 'rxjs';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { getUserRole } from 'src/app/utils/util';
import { SenderService } from '../data/sender.service';

export interface ISignInCredentials {
  email: string;
  password: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
  rol: string;
}

export interface ICreateCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface IPasswordReset {
  code: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  public uid: string;
  public rol: number;
  public token: string;

  constructor(private auth: AngularFireAuth, private http: HttpClient, private sender: SenderService) {}

  // tslint:disable-next-line:typedef
  signIn(credentials: ISignInCredentials) {
    return this.auth
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(({ user }) => {
        return user;
      });
  }

  login(credentials: ILoginCredentials){
    //console.log('login desde usuario.service',formData);

    return this.http.post(`${environment.base_url}/login`, credentials)
    .pipe(
      tap( (res:any)=> {
        //console.log(res);

        this.uid = res['id'];
        this.rol = res['rol'];

        switch (res['token']) {
          case 'ROL_ADMIN':
            this.rol = 0;
            break;
          case 'ROL_PROFESOR':
            this.rol = 1;
            break;
          case 'ROL_ALUMNO':
            this.rol = 2;
            break;
          default:
            break;
        }
        this.token = res['token'];

        localStorage.setItem('token', res['token']);
        localStorage.setItem('rol', res['rol']);
        // localStorage.setItem('uid', res['id']);
        this.sender.idUser = res['id'];
        console.log('Se ha hecho login');
        //console.log(res['rol']);
      })
    );
  }

  signOut() {
    localStorage.removeItem('token');
    this.uid = '';
    this.rol = -1;
    this.token = '';
  }

  // signOut = () => from(this.auth.signOut());

  // tslint:disable-next-line:typedef
  register(credentials: ICreateCredentials) {
    return this.auth
      .createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(async ({ user }) => {
        user.updateProfile({
          displayName: credentials.displayName,
        });
        this.auth.updateCurrentUser(user);
        return user;
      });
  }

  // tslint:disable-next-line:typedef
  sendPasswordEmail(email) {
    return this.auth.sendPasswordResetEmail(email).then(() => {
      return true;
    });
  }

  // tslint:disable-next-line:typedef
  resetPassword(credentials: IPasswordReset) {
    return this.auth
      .confirmPasswordReset(credentials.code, credentials.newPassword)
      .then((data) => {
        return data;
      });
  }

  // tslint:disable-next-line:typedef
  async getUser() {
    const u = await this.auth.currentUser;
    return { ...u, uid: this.uid, role: getUserRole() };
  }
}
