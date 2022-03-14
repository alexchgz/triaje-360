import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  HttpClient
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
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

  signIn(credentials: ISignInCredentials) {
    return this.auth
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(({ user }) => {
        return user;
      });
  }

  login(credentials: ILoginCredentials){

    return this.http.post(`${environment.base_url}/login`, credentials)
    .pipe(
      tap( (res:any)=> {
        this.uid = res['id'];

        switch (res['rol']) {
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
        this.sender.idUser = res['id'];
        
      })
    );
  }

  signOut() {
    localStorage.removeItem('token');
    this.uid = '';
    this.rol = -1;
    this.token = '';
  }

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

  sendPasswordEmail(email) {
    return this.auth.sendPasswordResetEmail(email).then(() => {
      return true;
    });
  }

  resetPassword(credentials: IPasswordReset) {
    return this.auth
      .confirmPasswordReset(credentials.code, credentials.newPassword)
      .then((data) => {
        return data;
      });
  }

  async getUser() {
    const u = await this.auth.currentUser;
    return { ...u, uid: this.uid, role: this.rol };
  }
}
